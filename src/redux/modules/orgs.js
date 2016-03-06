import axios from 'axios'
import { handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCHING_ORGS = 'FETCHING_ORGS'
export const FETCH_ORGS_SUCCESS = 'FETCH_ORGS_SUCCESS'
export const FETCH_ORGS_FAILED = 'FETCH_ORGS_FAILED'
export const FETCH_ORGS_DETAIL_SUCCESS = 'FETCH_ORGS_DETAIL_SUCCESS'
export const FETCH_ORGS_DETAIL_FAILED = 'FETCH_ORGS_DETAIL_FAILED'
export const FETCH_ORGS_REPOS_SUCCESS = 'FETCH_ORGS_REPOS_SUCCESS'
export const FETCH_ORGS_REPOS_FAILED = 'FETCH_ORGS_REPOS_FAILED'
export const FETCH_ORGS_REPOS_MILES_SUCCESS = 'FETCH_ORGS_REPOS_MILES_SUCCESS'

// ------------------------------------
// Github stuffs
// ------------------------------------
const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_USER_ORGS_URL = GITHUB_API_URL + '/user/orgs'
const GITHUB_ORGS_URL = GITHUB_API_URL + '/orgs'
const GITHUB_REPOS_URL = GITHUB_API_URL + '/repos'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchOrganizations = () => {
  console.log('fetch organizations')
  return (dispatch, getState) => {
    const { token } = getState().auth
    console.log('oauth token', token)
    dispatch(fetchingOrgs(true))
    return axios({
      url: GITHUB_USER_ORGS_URL,
      method: 'get',
      headers: {
        'Authorization': `token ${token}`
      },
      responseType: 'json'
    })
    .then((response) => {
      console.log(response.data)
      dispatch(fetchingOrgs(false))
      dispatch(fetchOrgsSuccess(response.data))
    })
    .catch((response) => {
      console.log(response.data)
      dispatch(fetchingOrgs(false))
      dispatch(fetchOrgsFailed(response.data))
    })
  }
}

export const fetchOrganization = (name) => {
  console.log('fetch organization by name', name)
  return (dispatch, getState) => {
    const { token } = getState().auth
    console.log('oauth token', token)
    dispatch(fetchingOrgs(true))
    return axios({
      url: GITHUB_ORGS_URL + `/${name}`,
      method: 'get',
      headers: {
        'Authorization': `token ${token}`
      },
      responseType: 'json'
    })
    .then((response) => {
      console.log(response.data)
      dispatch(fetchingOrgs(false))
      dispatch(fetchOrgDetailSuccess(response.data))
    })
    .catch((response) => {
      console.log(response.data)
      dispatch(fetchingOrgs(false))
      dispatch(fetchOrgDetailFailed(response.data))
    })
  }
}

export const fetchOrgRepos = (name) => {
  return (dispatch, getState) => {
    const { token } = getState().auth
    dispatch(fetchingOrgs(true))
    return axios({
      url: GITHUB_ORGS_URL + `/${name}/repos`,
      method: 'get',
      headers: {
        'Authorization': `token ${token}`
      },
      responseType: 'json'
    })
    .then((response) => {
      dispatch(fetchingOrgs(false))
      dispatch(fetchOrgReposSuccess(response.data))
      dispatch(fetchOrgReposMilestones(response.data))
    })
    .catch((response) => {
      dispatch(fetchingOrgs(false))
      dispatch(fetchOrgReposFailed(response.data))
    })
  }
}

export const fetchOrgReposMilestones = (repos) => {
  return (dispatch, getState) => {
    const { token } = getState().auth
    const fetchRepo = (repo) => {
      const url = GITHUB_REPOS_URL + `/${repo.full_name}/milestones`
      return axios({
        url,
        method: 'get',
        headers: {
          'Authorization': `token ${token}`
        },
        responseType: 'json'
      })
      .then((response) => {
        return Object.assign({}, { repo }, response)
      })
    }
    const jobs = repos.map((repo) => {
      return fetchRepo(repo)
    })
    return axios.all(jobs)
    .then(axios.spread((...response) => {
      console.log(response)
      response.map((resp) => {
        const miles = resp.data
        const { repo } = resp
        console.log('dispatch miles', repo, miles)
        dispatch(fetchRepoMilestonesSuccess(repo, miles))
      })
    }))
  }
}

export const fetchingOrgs = (payload): Action => ({
  type: FETCHING_ORGS,
  payload: payload
})

export const fetchOrgsSuccess = (payload): Action => ({
  type: FETCH_ORGS_SUCCESS,
  payload: payload
})

export const fetchOrgsFailed = (payload): Action => ({
  type: FETCH_ORGS_FAILED,
  payload: payload
})

export const fetchOrgDetailSuccess = (payload): Action => ({
  type: FETCH_ORGS_DETAIL_SUCCESS,
  payload: payload
})

export const fetchOrgDetailFailed = (payload): Action => ({
  type: FETCH_ORGS_DETAIL_FAILED,
  payload: payload
})

export const fetchOrgReposSuccess = (payload): Action => ({
  type: FETCH_ORGS_REPOS_SUCCESS,
  payload: payload
})

export const fetchOrgReposFailed = (payload): Action => ({
  type: FETCH_ORGS_REPOS_FAILED,
  payload: payload
})

export const fetchRepoMilestonesSuccess = (repo, miles = []): Action => ({
  type: FETCH_ORGS_REPOS_MILES_SUCCESS,
  repo,
  miles
})

export const actions = {
  fetchOrganization,
  fetchOrganizations,
  fetchOrgRepos
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  FETCHING_ORGS: (state, action) => ({
    ...state,
    processing: action.payload
  }),

  FETCH_ORGS_SUCCESS: (state, action) => ({
    ...state,
    list: action.payload,
    error: null
  }),

  FETCH_ORGS_FAILED: (state, action) => ({
    ...state,
    list: state.list,
    error: 'could not fetch organizations'
  }),

  FETCH_ORGS_DETAIL_SUCCESS: (state, action) => ({
    ...state,
    detail: action.payload,
    error: null
  }),

  FETCH_ORGS_DETAIL_FAILED: (state, action) => ({
    ...state,
    detail: {},
    error: 'could not fetch organization'
  }),

  FETCH_ORGS_REPOS_SUCCESS: (state, action) => ({
    ...state,
    repos: action.payload,
    error: null
  }),

  FETCH_ORGS_REPOS_FAILED: (state, action) => ({
    ...state,
    repos: [],
    error: 'could not fetch organization'
  }),

  FETCH_ORGS_REPOS_MILES_SUCCESS: (state, action) => {
    const milestones = Object.assign([], state.milestones)
    milestones[action.repo.id] = action.miles
    return {
      ...state,
      milestones: milestones,
      error: null
    }
  }
}, {
  detail: {},
  list: [],
  repos: [],
  error: null,
  processing: false
})

import axios from 'axios'
import { handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const FETCHING_ORGS = 'FETCHING_ORGS'
export const FETCH_ORGS_SUCCESS = 'FETCH_ORGS_SUCCESS'
export const FETCH_ORGS_FAILED = 'FETCH_ORGS_FAILED'

// ------------------------------------
// Github stuffs
// ------------------------------------
const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_ORGS_URL = GITHUB_API_URL + '/user/orgs'

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
      url: GITHUB_ORGS_URL,
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

export const actions = {
  fetchOrganizations
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  FETCHING_ORGS: (state, action) => ({
    processing: action.payload
  }),

  FETCH_ORGS_SUCCESS: (state, action) => ({
    list: action.payload,
    error: null
  }),

  FETCH_ORGS_FAILED: (state, action) => ({
    list: state.list,
    error: 'could not fetch organizations'
  })
}, {
  list: [],
  error: null,
  processing: false
})

/* @flow */
import axios from 'axios'
import { handleActions } from 'redux-actions'
import { push } from 'react-router-redux'

// ------------------------------------
// Constants
// ------------------------------------
export const AUTHENTICATE = 'AUTHENTICATE'
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS'
export const AUTHENTICATE_FAILED = 'AUTHENTICATE_FAILED'

// ------------------------------------
// Github stuffs
// ------------------------------------
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_ACCESS_TOKEN_URL = 'http://localhost:3000/access_token'
const GITHUB_SCOPES = 'user,repo,read:org'
const GITHUB_CLIENT_ID = '45378dee97bfeb666a92'
const GITHUB_REDIRECT_URI = 'http://localhost:3000/auth'

// ------------------------------------
// Actions
// ------------------------------------
export const login = () => {
  return () => {
    const scopes = `scopes=${GITHUB_SCOPES}`
    const client_id = `client_id=${GITHUB_CLIENT_ID}`
    const redirect_uri = `redirect_uri=${GITHUB_REDIRECT_URI}`
    const params = `${client_id}&${scopes}&${redirect_uri}`
    const auth_url = `${GITHUB_AUTH_URL}?${params}`
    console.log('auth_url', auth_url)
    window.location.href = auth_url
  }
}

export const authenticate = (code) => {
  return (dispatch) => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return axios({
      url: GITHUB_ACCESS_TOKEN_URL,
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      responseType: 'json',
      data: {
        client_id: GITHUB_CLIENT_ID,
        code
      }
    })
    .then((response) => {
      console.log(response.data)
      dispatch(authenticateSuccess(response.data))
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('token', response.data.token)
    })
    .catch((response) => {
      console.log(response.data)
      dispatch(authenticateFailed(response.data))
    })
    .then((response) => {
      dispatch(push('/'))
    })
  }
}

export const authenticateSuccess = (payload): Action => ({
  type: AUTHENTICATE_SUCCESS,
  payload: payload
})

export const authenticateFailed = (payload): Action => ({
  type: AUTHENTICATE_FAILED,
  payload: payload
})

export const actions = {
  login,
  authenticate
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  AUTHENTICATE: (state, action) => ({
    user: null,
    token: null,
    error: null
  }),

  AUTHENTICATE_SUCCESS: (state, action) => ({
    user: action.payload.user,
    token: action.payload.token,
    error: null
  }),

  AUTHENTICATE_FAILED: (state, action) => ({
    user: null,
    token: null,
    error: action.payload.error
  })
}, {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token')
})

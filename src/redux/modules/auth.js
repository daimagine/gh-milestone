/* @flow */
import { handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const AUTHENTICATE = 'AUTHENTICATE'
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS'

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

export const authenticate = (code) => ({
  type: AUTHENTICATE,
  url: GITHUB_ACCESS_TOKEN_URL,
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: {
    client_id: GITHUB_CLIENT_ID,
    code
  },
  then: AUTHENTICATE_SUCCESS
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
    token: null
  }),

  AUTHENTICATE_SUCCESS: (state, action) => ({
    user: action.response.result.user,
    token: action.response.result.token
  })
}, {
  user: null,
  token: null
})

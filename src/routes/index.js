import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { actions as authActions } from 'redux/modules/auth'

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout'
import DashboardView from 'views/DashboardView/DashboardView'
import HomeView from 'views/HomeView/HomeView'
import LoginView from 'views/LoginView/LoginView'
import NotFoundView from 'views/NotFoundView/NotFoundView'

const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.auth.user, // how to get the user state
  redirectAction: authActions.login, // redux action to dispatch for redirect
  wrapperDisplayName: 'UserIsAuthenticated' // a nice name for this auth check
})

export default (store) => (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={UserIsAuthenticated(DashboardView)} />
    <Route path='/auth' component={LoginView} />
    <Route path='/sample' component={HomeView} />
    <Route path='/404' component={NotFoundView} />
    <Redirect from='*' to='/404' />
  </Route>
)

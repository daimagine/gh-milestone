import { combineReducers } from 'redux'
import { routeReducer as router } from 'react-router-redux'
import counter from './modules/counter'
import locale from './modules/locale'
import auth from './modules/auth'
import orgs from './modules/orgs'

export default combineReducers({
  counter,
  router,
  locale,
  auth,
  orgs
})

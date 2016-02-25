
import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router' // renamed react-router-redux
import phrase from './phrase'
import context from './context'
import dropdown from './dropdown'
import ui from './ui'
import headerData from './headerData'
import suggestions from './suggestions'

const rootReducer = combineReducers({
  context,
  dropdown,
  phrases: phrase,
  routing: routeReducer,
  ui: ui,
  data: headerData,
  suggestions
})

export default rootReducer

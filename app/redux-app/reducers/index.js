
import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router' // renamed react-router-redux
import phrase from './phrase'
import context from './context'
import dropdown from './dropdown'
import ui from './ui'
import headerData from './headerData'

const rootReducer = combineReducers({
  context,
  dropdown,
  phrases: phrase,
  routing: routeReducer,
  ui: ui,
  data: headerData
})

export default rootReducer

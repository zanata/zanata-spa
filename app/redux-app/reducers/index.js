
import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import phrase from './phrase'
import context from './context'
import dropdown from './dropdown'

const rootReducer = combineReducers({
  context,
  dropdown,
  phrases: phrase,
  routing: routeReducer
})

export default rootReducer

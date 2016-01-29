
import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import phrases from './phrase'
import context from './context'

const rootReducer = combineReducers({
  routing: routeReducer,
  context,
  phrases
})

export default rootReducer

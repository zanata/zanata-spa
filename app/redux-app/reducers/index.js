
import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import phrases from './phrase'

const rootReducer = combineReducers({
  routing: routeReducer,
  phrases
})

export default rootReducer

import { ROUTING_PARAMS_CHANGED } from '../actions'

const routingParamsReducer = (state, action) => {
  switch (action.type) {
    case ROUTING_PARAMS_CHANGED:
      return action.params || {}
    default:
      return state || {}
  }
}

export default routingParamsReducer

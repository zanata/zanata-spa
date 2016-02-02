import { ROUTING_PARAMS_CHANGED } from '../actions'

const defaultState = {
  sourceLocale: {
    localeId: 'en-US',
    name: 'English'
  }
}

const routingParamsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ROUTING_PARAMS_CHANGED:
      return {...state, ...action.params}
    default:
      return state
  }
}

export default routingParamsReducer

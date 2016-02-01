
export const ROUTING_PARAMS_CHANGED = 'ROUTING_PARAMS_CHANGED'
export function routingParamsChanged (newParams) {
  return {
    type: ROUTING_PARAMS_CHANGED,
    params: newParams
  }
}

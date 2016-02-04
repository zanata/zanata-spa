
export const ROUTING_PARAMS_CHANGED = 'ROUTING_PARAMS_CHANGED'
export function routingParamsChanged (newParams) {
  // TODO pahuang should we start fetching thing here?

  return {
    type: ROUTING_PARAMS_CHANGED,
    params: newParams
  }
}

/**
 * Every dropdown should have a reference-unique key. An empty object is
 * recommended since it is unique with reference equality checks.
 */
export const TOGGLE_DROPDOWN = 'TOGGLE_DROPDOWN'
export function toggleDropdown (dropdownKey) {
  return { type: TOGGLE_DROPDOWN, key: dropdownKey }
}

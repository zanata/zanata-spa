export const RESET_STATUS_FILTERS = Symbol('RESET_STATUS_FILTERS')
export function resetStatusFilter () {
  return {type: RESET_STATUS_FILTERS}
}

export const UPDATE_STATUS_FILTER = Symbol('UPDATE_STATUS_FILTER')
export function updateStatusFilter (status) {
  return (dispatch) => {
    dispatch({type: UPDATE_STATUS_FILTER, status})
    // needed in case there is a different page count after filtering
    dispatch(clampPage())
  }
}

/* Adjust the page number so it is in the valid range.
 * Dispatch after changing the filter.
 */
export const CLAMP_PAGE = Symbol('CLAMP_PAGE')
export function clampPage () {
  return { type: CLAMP_PAGE }
}

export const FIRST_PAGE = Symbol('FIRST_PAGE')
export function firstPage () {
  return {type: FIRST_PAGE}
}

export const NEXT_PAGE = Symbol('NEXT_PAGE')
export function nextPage () {
  return {type: NEXT_PAGE}
}

export const PREVIOUS_PAGE = Symbol('PREVIOUS_PAGE')
export function previousPage () {
  return {type: PREVIOUS_PAGE}
}

export const LAST_PAGE = Symbol('LAST_PAGE')
export function lastPage () {
  return {type: LAST_PAGE}
}

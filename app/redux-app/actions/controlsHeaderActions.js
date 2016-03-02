export const RESET_STATUS_FILTERS = Symbol('RESET_STATUS_FILTERS')
export function resetStatusFilter () {
  return {type: RESET_STATUS_FILTERS}
}

export const UPDATE_STATUS_FILTER = Symbol('UPDATE_STATUS_FILTER')
export function updateStatusFilter (status) {
  return {type: UPDATE_STATUS_FILTER, data: status}
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

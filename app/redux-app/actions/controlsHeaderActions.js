
export const RESET_STATUS_FILTERS = 'RESET_STATUS_FILTERS'
export function resetStatusFilter() {
  return {type: RESET_STATUS_FILTERS}
}

export const UPDATE_STATUS_FILTER = 'UPDATE_STATUS_FILTER'
export function updateStatusFilter(status) {
  return {type: UPDATE_STATUS_FILTER, data: status}
}

export const FIRST_PAGE = 'FIRST_PAGE'
export function firstPage() {
  return {type: FIRST_PAGE}
}

export const NEXT_PAGE = 'NEXT_PAGE'
export function nextPage() {
  return {type: NEXT_PAGE}
}

export const PREVIOUS_PAGE = 'PREVIOUS_PAGE'
export function previousPage() {
  return {type: PREVIOUS_PAGE}
}

export const LAST_PAGE = 'LAST_PAGE'
export function lastPage() {
  return {type: LAST_PAGE}
}

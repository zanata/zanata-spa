import { TOGGLE_DROPDOWN } from '../actions'

const defaultState = {
  openDropdownKey: undefined
}

/**
 * State is just the key of the currently open dropdown, or undefined if
 * no dropdown is open.
 */
const dropdownReducer = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_DROPDOWN:
      const isOpen = action.key === state
      return {
        openDropdownKey: isOpen ? undefined : action.key
      }
    default:
      return state
  }
}

export default dropdownReducer

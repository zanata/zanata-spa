/**
 * Action creators for redux
 */

// Actions from user interactions

export const CHANGE_UI_LOCALE = 'CHANGE_UI_LOCALE'
export const TOGGLE_DROPDOWN = 'TOGGLE_DROPDOWN'
export const RESET_FILTER = 'RESET_FILTER'
export const CHANGE_FILTER = 'CHANGE_FILTER'

// FIXME using the strings that Angular expects for now,
//       change to be consistent with other strings.
export const FilterStates = {
  APPROVED: 'approved',
  TRANSLATED: 'translated',
  NEEDS_WORK: 'needsWork',
  UNTRANSLATED: 'untranslated'
}

export const CHANGE_PAGE = 'CHANGE_PAGE'

export const Pages = {
  FIRST_PAGE: 'FIRST_PAGE',
  PREVIOUS_PAGE: 'PREVIOUS_PAGE',
  NEXT_PAGE: 'NEXT_PAGE',
  LAST_PAGE: 'LAST_PAGE'
}

export const TOGGLE_SUGGESTION_PANEL = 'TOGGLE_SUGGESTION_PANEL'
export const TOGGLE_KEYBOARD_SHORTCUTS_MODAL = 'TOGGLE_KEYBOARD_SHORTCUTS_MODAL'
export const TOGGLE_NAVIGATION_HEADER = 'TOGGLE_NAVIGATION_HEADER'

export function changeUiLocale (locale) {
  return { type: CHANGE_UI_LOCALE, locale: locale }
}

export function toggleDropdown (dropdownKey) {
  return { type: TOGGLE_DROPDOWN, key: dropdownKey }
}

export function resetFilter () {
  return { type: RESET_FILTER }
}

// FIXME at the moment this toggles the state in Angular,
//       might want to use the boolean from onChange to set
//       instead.
export function changeFilter (state) {
  return { type: CHANGE_FILTER, state: state }
}

/**
 * page must be one of Pages
 */
export function changePage (page) {
  // TODO verify that page is in Pages?
  return { type: CHANGE_PAGE, page: page }
}

export function toggleSuggestionPanel () {
  return { type: TOGGLE_SUGGESTION_PANEL }
}

export function toggleKeyboardShortcutsModal () {
  return { type: TOGGLE_KEYBOARD_SHORTCUTS_MODAL }
}

export function toggleNavigationHeader () {
  return { type: TOGGLE_NAVIGATION_HEADER }
}

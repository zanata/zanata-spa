/**
 * Action creators for redux
 */

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

// TODO these action creators need access to Angular scope.
//      when they no longer require it, they should be moved out
//      of the angular directive and into here or other non-angular
//      files.

// export function changeUiLocale (locale) {
//   return { type: CHANGE_UI_LOCALE, locale: locale }
// }

// export function toggleDropdown (dropdownKey) {
//   return { type: TOGGLE_DROPDOWN, key: dropdownKey }
// }

// export function resetFilter () {
//   return { type: RESET_FILTER }
// }

// // FIXME at the moment this toggles the state in Angular,
// //       might want to use the boolean from onChange to set
// //       instead.
// export function changeFilter (state) {
//   return { type: CHANGE_FILTER, state: state }
// }

// /**
//  * page must be one of Pages
//  */
// export function changePage (page) {
//   // TODO verify that page is in Pages?
//   return { type: CHANGE_PAGE, page: page }
// }

// export function toggleSuggestionPanel () {
//   return { type: TOGGLE_SUGGESTION_PANEL }
// }

// export function toggleKeyboardShortcutsModal () {
//   return { type: TOGGLE_KEYBOARD_SHORTCUTS_MODAL }
// }

// export function toggleNavigationHeader () {
//   return { type: TOGGLE_NAVIGATION_HEADER }
// }

export const TEXTFLOW_COUNTS_UPDATED = 'TEXTFLOW_COUNTS_UPDATED'

/**
 * counts: number of textflows keyed against each state
 */
export function textflowCountsUpdated (counts) {
  return { type: TEXTFLOW_COUNTS_UPDATED, counts: counts }
}

export const GRAVATAR_URL_UPDATED = 'GRAVATAR_URL_UPDATED'

export function gravatarUrlUpdated (url) {
  return { type: GRAVATAR_URL_UPDATED, url: url }
}

export const UI_LOCALE_CHANGED = 'UI_LOCALE_CHANGED'

export function uiLocaleChanged (localeId) {
  return { type: UI_LOCALE_CHANGED, localeId: localeId }
}

export const USER_NAME_UPDATED = 'USER_NAME_UPDATED'

export function userNameUpdated (name) {
  return { type: USER_NAME_UPDATED, name: name }
}

export const UI_LOCALES_CHANGED = 'UI_LOCALES_CHANGED'

/**
 * locales: object with localeId as key, locale object as value
 *          locale object is { id, name }
 */
export function uiLocalesChanged (locales) {
  return { type: UI_LOCALES_CHANGED, locales: locales }
}

export const PROJECT_SLUG_CHANGED = 'PROJECT_SLUG_CHANGED'
export const VERSION_SLUG_CHANGED = 'VERSION_SLUG_CHANGED'

export function projectSlugChanged (slug) {
  return { type: PROJECT_SLUG_CHANGED, slug: slug }
}

export function versionSlugChanged (slug) {
  return { type: VERSION_SLUG_CHANGED, slug: slug }
}

export const SELECTED_DOC_CHANGED = 'SELECTED_DOC_CHANGED'

export function selectedDocChanged (docId) {
  return { type: SELECTED_DOC_CHANGED, doc: docId }
}

export const SELECTED_LOCALE_CHANGED = 'SELECTED_LOCALE_CHANGED'

export function selectedLocaleChanged (locale) {
  return { type: SELECTED_LOCALE_CHANGED, locale: locale }
}

export const PROJECT_VERSION_DOCS_CHANGED = 'PROJECT_VERSION_DOCS_CHANGED'

export function projectVersionDocsChanged (docs) {
  return { type: PROJECT_VERSION_DOCS_CHANGED, docs: docs }
}

export const TEXTFLOW_FILTER_UPDATED = 'TEXTFLOW_FILTER_UPDATED'

/**
 * filter is { approved, translated, needsWork, untranslated }
 *             with all values being numbers
 */
export function textflowFilterUpdated (filter) {
  return { type: TEXTFLOW_FILTER_UPDATED, filter: filter }
}

export const PROJECT_VERSION_LOCALES_CHANGED = 'PROJECT_VERSION_LOCALES_CHANGED'

export function projectVersionLocalesChanged (locales) {
  return { type: PROJECT_VERSION_LOCALES_CHANGED, locales: locales }
}

export const PAGE_COUNT_CHANGED = 'PAGE_COUNT_CHANGED'

export function pageCountChanged (count) {
  return { type: PAGE_COUNT_CHANGED, count: count }
}

export const PAGE_NUMBER_CHANGED = 'PAGE_NUMBER_CHANGED'

export function pageNumberChanged (num) {
  return { type: PAGE_NUMBER_CHANGED, num: num }
}

export const PROJECT_NAME_UPDATED = 'PROJECT_NAME_UPDATED'

export function projectNameUpdated (name) {
  return { type: PROJECT_NAME_UPDATED, name: name }
}

export const PANEL_VISIBILITY_CHANGED = 'PANEL_VISIBILITY_CHANGED'

/**
 * panel: string name of panel
 * visible: bool true if visible
 */
export function panelVisibilityChanged (panel, visible) {
  return { type: PANEL_VISIBILITY_CHANGED, panel: panel, visible: visible }
}

export const DROPDOWN_CHANGED = 'DROPDOWN_CHANGED'

/**
 * dropdown is the key of the currently open dropdown
 */
export function dropdownChanged (dropdown) {
  return { type: DROPDOWN_CHANGED, dropdown: dropdown }
}

export const GETTEXT_CATALOG_CHANGED = 'GETTEXT_CATALOG_CHANGED'

export function gettextCatalogUpdated (gettextCatalog) {
  return { type: GETTEXT_CATALOG_CHANGED, catalog: gettextCatalog }
}

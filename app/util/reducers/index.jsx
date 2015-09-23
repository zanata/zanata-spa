
import { merge, isArray } from 'lodash'
import {
  DROPDOWN_CHANGED,
  GETTEXT_CATALOG_CHANGED,
  GRAVATAR_URL_UPDATED,
  PAGE_COUNT_CHANGED,
  PAGE_NUMBER_CHANGED,
  PANEL_VISIBILITY_CHANGED,
  PROJECT_NAME_UPDATED,
  PROJECT_SLUG_CHANGED,
  PROJECT_VERSION_DOCS_CHANGED,
  PROJECT_VERSION_LOCALES_CHANGED,
  SELECTED_DOC_CHANGED,
  SELECTED_LOCALE_CHANGED,
  TEXTFLOW_COUNTS_UPDATED,
  TEXTFLOW_FILTER_UPDATED,
  UI_LOCALE_CHANGED,
  UI_LOCALES_CHANGED,
  USER_NAME_UPDATED,
  VERSION_SLUG_CHANGED } from 'actions'

// this should be broken into multiple reducer functions using
// reducer composition
export default function (state, action) {
  switch (action.type) {
    case GRAVATAR_URL_UPDATED:
      return updateState({ data: { user: { gravatarUrl: action.url } } })
    case USER_NAME_UPDATED:
      return updateState({ data: { user: { name: action.name } } })
    case PROJECT_SLUG_CHANGED:
      return updateState({ data: {
        context: { projectVersion: { project: { slug: action.slug } } }
      } })
    case PROJECT_NAME_UPDATED:
      return updateState({ data: {
        context: { projectVersion: { project: { name: action.name } } }
      } })
    case VERSION_SLUG_CHANGED:
      return updateState({
        data: { context: { projectVersion: { version: action.slug } } }
      })
    case PROJECT_VERSION_DOCS_CHANGED:
      return updateState({
        data: { context: { projectVersion: { docs: action.docs } } }
      })
    case PROJECT_VERSION_LOCALES_CHANGED:
      return updateState({
        data: { context: { projectVersion: { locales: action.locales } } }
      })
    case SELECTED_DOC_CHANGED:
      return updateState({
        data: { context: { selectedDoc: { id: action.doc } } }
      })
    case TEXTFLOW_COUNTS_UPDATED:
      return updateState({
        data: { context: { selectedDoc: { counts: action.counts } } }
      })
    case SELECTED_LOCALE_CHANGED:
      return updateState({
        data: { context: { selectedLocale: action.locale } }
      })
    case UI_LOCALE_CHANGED:
      return updateState({ ui: { selectedUiLocale: action.localeId } })
    case UI_LOCALES_CHANGED:
      return updateState({ ui: { uiLocales: action.locales } })
    case TEXTFLOW_FILTER_UPDATED:
      return updateState({ ui: { textFlowDisplay: { filter: action.filter } } })
    case PAGE_COUNT_CHANGED:
      return updateState({
        ui: { textFlowDisplay: { pageCount: action.count } }
      })
    case PAGE_NUMBER_CHANGED:
      return updateState({
        ui: { textFlowDisplay: { pageNumber: action.num } }
      })
    case PANEL_VISIBILITY_CHANGED:
      // TODO ensure panel is a known one
      return updateState({
        ui: { panels: { [action.panel]: { visible: action.visible } } }
      })
    case DROPDOWN_CHANGED:
      return updateState({ ui: { dropdowns: { current: action.dropdown } } })
    case GETTEXT_CATALOG_CHANGED:
      return updateState({ ui: { gettextCatalog: action.catalog } })
    default:
      return state
  }

  /**
   * return a copy of the state with the given changes deeply merged into it
   * arrays will always replace existing arrays, rather than combine them
   */
  function updateState (changes) {
    return merge({}, state, changes, function (oldVal, newVal) {
      if (isArray(oldVal)) {
        return newVal
      }
      // undefined causes default merge behaviour
    })
  }
}

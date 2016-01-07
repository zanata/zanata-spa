
import React from 'react/addons'
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
    case '@@redux/INIT':
      return state

    case GRAVATAR_URL_UPDATED:
      return update({data: {user: {gravatarUrl: {$set: action.url}}}})
    case USER_NAME_UPDATED:
      return update({data: {user: {name: {$set: action.name}}}})
    case PROJECT_SLUG_CHANGED:
      return update({data:
        {context: {projectVersion: {project: {slug: {$set: action.slug}}}}}
      })
    case PROJECT_NAME_UPDATED:
      return update({data: {
        context: {projectVersion: {project: {name: {$set: action.name}}}}
      }})
    case VERSION_SLUG_CHANGED:
      return update({
        data: {context: {projectVersion: {version: {$set: action.slug}}}}
      })
    case PROJECT_VERSION_DOCS_CHANGED:
      return update({
        data: {context: {projectVersion: {docs: {$set: action.docs}}}}
      })
    case PROJECT_VERSION_LOCALES_CHANGED:
      return update({
        data: {context: {projectVersion: {locales: {$set: action.locales}}}}
      })
    case SELECTED_DOC_CHANGED:
      return update({data: {context: {selectedDoc: {id: {$set: action.doc}}}}})
    case TEXTFLOW_COUNTS_UPDATED:
      return update({
        data: {context: {selectedDoc: {counts: {$set: action.counts}}}}
      })
    case SELECTED_LOCALE_CHANGED:
      return update({data: {context: {selectedLocale: {$set: action.locale}}}})
    case UI_LOCALE_CHANGED:
      return update({ui: {selectedUiLocale: {$set: action.localeId}}})
    case UI_LOCALES_CHANGED:
      return update({ui: {uiLocales: {$set: action.locales}}})
    case TEXTFLOW_FILTER_UPDATED:
      return update({ui: {textFlowDisplay: {filter: {$set: action.filter}}}})
    case PAGE_COUNT_CHANGED:
      return update({ui: {textFlowDisplay: {pageCount: {$set: action.count}}}})
    case PAGE_NUMBER_CHANGED:
      return update({ui: {textFlowDisplay: {pageNumber: {$set: action.num}}}})
    case PANEL_VISIBILITY_CHANGED:
      // TODO ensure panel is a known one
      return update({
        ui: {panels: {[action.panel]: {visible: {$set: action.visible}}}}
      })
    case DROPDOWN_CHANGED:
      return update({ui: {dropdowns: {current: {$set: action.dropdown}}}})
    case GETTEXT_CATALOG_CHANGED:
      return update({ui: {gettextCatalog: {$set: action.catalog}}})
    default:
      console.warn('action was not handled (index)', action)
      return state
  }

  function update (commands) {
    // FIXME update to version that does not lose reference equality when
    //       setting an identical object
    //       see: https://github.com/facebook/react/pull/4968
    return React.addons.update(state, commands)
  }
}

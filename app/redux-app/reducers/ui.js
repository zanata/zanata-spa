import { TOGGLE_HEADER, TOGGLE_SUGGESTIONS, UI_LOCALES_FETCHED, CHANGE_UI_LOCALE } from '../actions/headerActions'
import { RESET_STATUS_FILTERS, UPDATE_STATUS_FILTER, FIRST_PAGE, PREVIOUS_PAGE, NEXT_PAGE, LAST_PAGE } from '../actions/controlsHeaderActions'
import { TOGGLE_DROPDOWN } from '../actions'
import {prepareLocales} from '../utils/Util'
import updateObject from 'react-addons-update'

const docsDropdownKey = 'DOCS_DROPDOWN'
const localeDropdownKey = 'LOCALE_DROPDOWN'
const uiLocaleDropdownKey = 'UI_LOCALE_DROPDOWN'

// migrated from LocaleService
const DEFAULT_LOCALE = {
  'localeId': 'en-US',
  'name': 'English'
}

const DEFAULT_FILTER_STATE = {
  all: true,
  approved: false,
  translated: false,
  needsWork: false,
  untranslated: false
}

const defaultState = {
  panels: {
    navHeader: {
      visible: true
    },
    suggestions: {
      visible: true
    }

  },
  uiLocales: {},
  selectedUiLocale: DEFAULT_LOCALE.localeId,
  dropdowns: {
    current: undefined,
    docsKey: docsDropdownKey,
    localeKey: localeDropdownKey,
    uiLocaleKey: uiLocaleDropdownKey
  },
  textFlowDisplay: {
    filter: DEFAULT_FILTER_STATE,
    pageNumber: 1, // TODO pahuang implement this
    pageCount: 50 // TODO pahuang implement this
  },
  gettextCatalog: {
    getString: (key) => {
      // TODO pahuang implement gettextCatalog.getString
      //console.log('gettextCatalog.getString')
      return key;
    }
  }
}

const isStatusSame = (statuses) => {
  return statuses.approved === statuses.translated &&
      statuses.translated === statuses.needsWork &&
      statuses.needsWork === statuses.untranslated
}

const ui = (state = defaultState, action) => {
  const currentPageNumber = state.textFlowDisplay.pageNumber;

  const updatePageNumberIfChanged = (newPageNumber) => {
    if (currentPageNumber !== newPageNumber) {
      return updateObject(state, {
        textFlowDisplay: {
          pageNumber: {
            $set: newPageNumber
          }
        }
      });
    } else {
      return state;
    }
  };

  switch (action.type) {
    case TOGGLE_HEADER:
      return updateObject(state, {
        panels: {
          navHeader: {
            visible: {$set: !state.panels.navHeader.visible}
          }
        }
      });

    case TOGGLE_SUGGESTIONS:
      return updateObject(state, {
        panels: {
          suggestions: {
            visible: {$set: !state.panels.suggestions.visible}
          }
        }
      });

    case UI_LOCALES_FETCHED:
      const locales = prepareLocales(action.data);
      return updateObject(state, {
        uiLocales: {
          $set: locales
        }
      });

    case CHANGE_UI_LOCALE:
      // TODO pahuang implement change ui locale
      /*
       appCtrl.myInfo.locale = locale
       var uiLocaleId = appCtrl.myInfo.locale.localeId
       if (!StringUtil.startsWith(uiLocaleId,RESET_STATUS_FILTERS
       LocaleService.DEFAULT_LOCALE.localeId, true)) {
       gettextCatalog.loadRemote(UrlService.uiTranslationURL(uiLocaleId))
       .then(
       function () {
       gettextCatalog.setCurrentLanguage(uiLocaleId)
       },
       function (error) {
       MessageHandler.displayInfo('Error loading UI locale. ' +
       'Default to \'' + LocaleService.DEFAULT_LOCALE.name +
       '\': ' + error)
       gettextCatalog.setCurrentLanguage(
       LocaleService.DEFAULT_LOCALE)
       appCtrl.myInfo.locale = LocaleService.DEFAULT_LOCALE
       })
       } else {
       // wrapped in apply because this MUST be run at the appropriate part of
       // the angular cycle, or it does not remove the old strings from the UI
       // (you end up with multiple strings displaying).
       $scope.$apply(function () {
       gettextCatalog.setCurrentLanguage(
       LocaleService.DEFAULT_LOCALE.localeId)
       })
       }
       */
      return updateObject(state, {
        selectedUiLocale: {
          $set: action.data
        }
      });
      return state;

    case TOGGLE_DROPDOWN:
      // TODO pahuang this listens to the same action
      return updateObject(state, {
        dropdowns: {
          current: {
            $set: action.key
          }
        }
      });

    case RESET_STATUS_FILTERS:
      return updateObject(state, {
        textFlowDisplay: {
          filter: {
            $set: DEFAULT_FILTER_STATE
          }
        }
      });

    case UPDATE_STATUS_FILTER:
      let newFilter = Object.assign({}, state.textFlowDisplay.filter, {all: false});
      newFilter[action.data] = !newFilter[action.data];

      if (isStatusSame(newFilter)) {
        return updateObject(state, {
          textFlowDisplay: {
            filter: {
              $set: DEFAULT_FILTER_STATE
            }
          }
        })
      } else {
        return updateObject(state, {
          textFlowDisplay: {
            filter: {
              $set: newFilter
            }
          }
        })
      }

    case FIRST_PAGE:
      return updatePageNumberIfChanged(1);

    case PREVIOUS_PAGE:
      const prevPage = Math.max(currentPageNumber - 1, 1);
      return updatePageNumberIfChanged(prevPage);

    case NEXT_PAGE:
      const nextPage = Math.min(currentPageNumber + 1, state.textFlowDisplay.pageCount);
      return updatePageNumberIfChanged(nextPage);

    case LAST_PAGE:
      return updatePageNumberIfChanged(state.textFlowDisplay.pageCount);

    default:
      return state
  }
};

export default ui

import { TOGGLE_HEADER, UI_LOCALES_FETCHED, CHANGE_UI_LOCALE } from '../actions/headerActions'
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
    filter: {
      all: true,
      approved: true,
      translated: true,
      needsWork: true,
      untranslated: true
    },
    pageNumber: 0,
    pageCount: 50
  },
  gettextCatalog: {
    getString: (key) => {
      // TODO pahuang implement gettextCatalog.getString
      //console.log('gettextCatalog.getString')
      return key;
    }
  }
}

const ui = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_HEADER:
      return updateObject(state, {
        panels: {
          navHeader: {
            visible: {$set: !state.panels.navHeader.visible}
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
      // TODO pahuang implement this
      /*
      appCtrl.myInfo.locale = locale
      var uiLocaleId = appCtrl.myInfo.locale.localeId
      if (!StringUtil.startsWith(uiLocaleId,
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

    default:
      return state
  }
};

export default ui

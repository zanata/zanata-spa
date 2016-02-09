import { TOGGLE_HEADER, FETCHED_UI_LOCALES, CHANGE_UI_LOCALE } from '../actions/headerActions'
import { TOGGLE_DROPDOWN } from '../actions'

import updateObject from 'react-addons-update'

const docsDropdownKey = 'DOCS_DROPDOWN'
const localeDropdownKey = 'LOCALE_DROPDOWN'
const uiLocaleDropdownKey = 'UI_LOCALE_DROPDOWN'

const defaultState = {
  panels: {
    navHeader: {
      visible: true
    },
    suggestions: {
      visible: true
    }

  },
  uiLocales: {
    'en-US': {
      id: 'en-US',
      name: 'English'
    }
  },
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
      // TODO pahuang implement this
      console.log('gettextCatalog.getString')
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
      })
    case FETCHED_UI_LOCALES:
      return updateObject(state, {
        uiLocales: {$set: action.data}
      });
    case CHANGE_UI_LOCALE:
      console.log('ui locale changed to ' + locale)
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

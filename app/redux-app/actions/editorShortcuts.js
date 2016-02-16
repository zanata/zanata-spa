import {getStatusInfo} from '../utils/TransStatusService'
import {getSaveButtonStatus, hasTranslationChanged} from '../utils/PhraseUtil'
import _ from 'lodash'
import {copyFromSource,
    undoEdit,
    cancelEdit,
    savePhraseWithStatus} from './phrases'
import {toggleDropdown} from './index'

const shortcutInfo = (keys, keyAction, description, eventType) => {
  keys = Array.isArray(keys) ? keys : [keys]
  return {
    keyConfig: {
      keys,
      eventType
    },
    keyAction,
    description
  }
}

// ================== key handlers start =====================
export const copyFromSourceAction = (event) => {
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    if (selectedPhraseId) {
      event.preventDefault()
      dispatch(copyFromSource(selectedPhraseId))
    }
  }
}

/**
 * Generate a callback that will copy one of the suggestions to the editor.
 *
 * @param {number} oneBasedIndex the 1-based index of the suggestion that
 *                               this callback will copy
 * @return {function} callback that will copy the nth suggestion.
 */
const copySuggestionCallback = (oneBasedIndex, event) => {
  return (dispatch, getState) => {
    if (getState().phrases.selectedPhraseId) {
      event.preventDefault()
      console.log('COPY_FROM_SUGGESTION_N', oneBasedIndex - 1)
      // TODO pahuang dispatch the actual action
    }
  }
}

const saveAsDropdownIsOpen = state => {
  // TODO pahuang is this reliable for checking save as dropdown is open?
  return state.dropdown.openDropdownKey &&
      typeof state.dropdown.openDropdownKey === 'object'
}

const cancelSaveAsMode = () => {
  return toggleDropdown(undefined)
}

const cancelSaveAsModeIfOn = (dispatch, state) => {
  if (saveAsDropdownIsOpen(state)) {
    // TODO pahuang maybe one cancel edit action will do all of below?
    dispatch(cancelSaveAsMode())
  }
}

const cancelEditCallback = (event) => {
  event.preventDefault()
  event.stopPropagation()
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    const phrase = getState().phrases.detail[selectedPhraseId]
    if (saveAsDropdownIsOpen(getState())) {
      cancelSaveAsModeIfOn()
      if (selectedPhraseId) {
        // TODO pahuang dispatch the action
        // dispatch(focusTranslation())
      }
    } else if (selectedPhraseId) {
      if (hasTranslationChanged(phrase)) {
        dispatch(undoEdit())
      } else {
        dispatch(cancelEdit())
      }
    }
  }
}

const saveAsCurrentButtonOptionCallback = (event) => {
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    const phrase = getState().phrases.detail[selectedPhraseId]
    const status = getSaveButtonStatus(phrase).ID
    if (selectedPhraseId) {
      event.preventDefault()
      dispatch(savePhraseWithStatus(phrase, status))
    }
  }
}

/**
 * This is to mimic sequence shortcut.
 * e.g. press ctrl-shift-s then press 'n' to save as
 * 'needs work'.
 */
const saveAsModeCallback = (event) => {
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    const phrase = getState().phrases.detail[selectedPhraseId]
    if (selectedPhraseId) {
      event.preventDefault()
      console.log('SAVE AS MODE OPEN', phrase)
      // TODO pahuang open the dropdown for selected phrase
      // dispatch(toggleDropdown())
      // addSaveAsModeExtensionKey(phrase, 'n', 'needsWork')
      // addSaveAsModeExtensionKey(phrase, 't', 'translated')
      // addSaveAsModeExtensionKey(phrase, 'a', 'approved')
    }
  }
}

const saveAs = (status) => {
  // const statusInfo = getStatusInfo(status)
  return (event) => {
    return (dispatch, getState) => {
      const selectedPhraseId = getState().phrases.selectedPhraseId
      const phrase = getState().phrases.detail[selectedPhraseId]
      if (selectedPhraseId) {
        event.preventDefault()
        dispatch(savePhraseWithStatus(phrase, status))
        console.info('save as ', {phrase: phrase, status: status})
      }
    }
  }
}

// TODO pahuang implment these two
function gotoNextRowCallback (event) {
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    if (selectedPhraseId) {
      event.preventDefault()
      event.stopPropagation()
      console.log('GOTO_NEXT_ROW', selectedPhraseId)
    }
  }
}

function gotoPreviousRowCallback (event) {
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    if (selectedPhraseId) {
      event.preventDefault()
      event.stopPropagation()
      console.log('GOTO_PREVIOUS_ROW', selectedPhraseId)
    }
  }
}

// ================== key handlers end =====================

/**
 * mod will be replaced by ctrl if on windows/linux or cmd if on mac.
 * By default it listens on keydown event.
 */
export const SHORTCUTS = {
  COPY_SOURCE: shortcutInfo(['alt+c', 'alt+g'],
      copyFromSourceAction, 'Copy source as translation'),

  COPY_SUGGESTION_1: shortcutInfo(
      'mod+alt+1', _.curry(copySuggestionCallback)(1),
      'Copy first suggestion as translation'),

  COPY_SUGGESTION_2: shortcutInfo(
    'mod+alt+2', _.curry(copySuggestionCallback)(2),
    'Copy second suggestion as translation'),

  COPY_SUGGESTION_3: shortcutInfo(
    'mod+alt+3', _.curry(copySuggestionCallback)(3),
    'Copy third suggestion as translation'),

  COPY_SUGGESTION_4: shortcutInfo(
    'mod+alt+4', _.curry(copySuggestionCallback)(4),
    'Copy fourth suggestion as translation'),

  CANCEL_EDIT: shortcutInfo('esc', cancelEditCallback, 'Cancel edit'),

  SAVE_AS_CURRENT_BUTTON_OPTION: shortcutInfo(
    'mod+s', saveAsCurrentButtonOptionCallback, 'Save'),

  SAVE_AS_MODE: {
    keyConfig: {
      keys: ['mod+shift+s'],
      sequenceKeys: [
        shortcutInfo('n', saveAs('needswork'), 'Save as Needs Work'),
        shortcutInfo('t', saveAs('translated'), 'Save as Translated'),
        shortcutInfo('a', saveAs('needswork'), 'Save as Approved')
      ]
    },
    keyAction: saveAsModeCallback,
    description: 'Save as...'
  },

  // this is just so we can show it in cheatsheet.
  // see ShortcutEnabledComponent
  __SAVE_AS_NEEDSWORK: shortcutInfo('mod+shift+s n',
      undefined, 'Save as needs work'),

  __SAVE_AS_TRANSLATED: shortcutInfo('mod+shift+s t',
      undefined, 'Save as translated'),

  __SAVE_AS_APPROVED: shortcutInfo('mod+shift+s a',
      undefined, 'Save as approved'),

  GOTO_NEXT_ROW_FAST: shortcutInfo(
    ['mod+enter', 'alt+k', 'alt+down'], gotoNextRowCallback,
    'Save (if changed) and go to next string'),

  GOTO_PREVIOUS_ROW: shortcutInfo(
    ['mod+shift+enter', 'alt+j', 'alt+up'], gotoPreviousRowCallback,
    'Save (if changed) and go to previous string')
/*
 Disable for now until status navigation implementation
 GOTO_NEXT_UNTRANSLATED: new ShortcutInfo(
 'tab+u', gotoToNextUntranslatedCallback)
 */
}

/*
 Disable for now until status navigation implementation

 function gotoToNextUntranslatedCallback(event) {
 event.preventDefault()
 event.stopPropagation()
 if (editorShortcuts.selectedTUCtrl) {
 console.log('GOTO_NEXT_UNTRANSLATED,
 currentContext())
 }
 // the shortcut is a tab + u combination
 // we don't want other tab event to trigger
 tabCombinationPressed = true
 }
 */

/**
 * Convert strings like cmd into symbols like ⌘
 * @param  {String} combo Key combination, e.g. 'mod+f'
 * @return {String} The key combination with symbols
 */
export const symbolizeKey = (combo) => {
  var map = {
    command: '⌘',
    shift: '⇧',
    left: '←',
    right: '→',
    up: '↑',
    down: '↓',
    'return': '↩',
    backspace: '⌫'
  }
  combo = combo.split('+')

  for (var i = 0; i < combo.length; i++) {
    // try to resolve command / ctrl based on OS:
    if (combo[i] === 'mod') {
      if (window.navigator &&
        window.navigator.platform.indexOf('Mac') >= 0) {
        combo[i] = 'command'
      } else {
        combo[i] = 'ctrl'
      }
    }

    combo[i] = map[combo[i]] || combo[i]
  }

  return combo.join(' + ')
}

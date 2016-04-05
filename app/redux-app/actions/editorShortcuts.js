import { getSaveButtonStatus, hasTranslationChanged } from '../utils/phrase'
import { curry } from 'lodash'
import {
  copyFromAlignedSource,
  undoEdit,
  cancelEdit,
  savePhraseWithStatus} from './phrases'
import {toggleDropdown} from './index'
import { moveNext, movePrevious } from './phraseNavigation'

function shortcutInfo (keys, keyAction, description, eventType) {
  keys = Array.isArray(keys) ? keys : [keys]
  return {
    keyConfig: {
      // Array of key combinations for this action
      keys,
      // (optional) keydown/keyup/keypress
      eventType
    },
    // The callback that is executed when the key combination is pressed
    keyAction,
    // Display description
    description
  }
}

/**
 * mod will be replaced by ctrl if on windows/linux or cmd if on mac.
 * By default it listens on keydown event.
 */
export const SHORTCUTS = {
  COPY_SOURCE: shortcutInfo(['alt+c', 'alt+g'],
      copyFromSourceHandler, 'Copy source as translation'),

  COPY_SUGGESTION_1: shortcutInfo(
      'mod+alt+1', curry(copySuggestionCallback)(1),
      'Copy first suggestion as translation'),

  COPY_SUGGESTION_2: shortcutInfo(
    'mod+alt+2', curry(copySuggestionCallback)(2),
    'Copy second suggestion as translation'),

  COPY_SUGGESTION_3: shortcutInfo(
    'mod+alt+3', curry(copySuggestionCallback)(3),
    'Copy third suggestion as translation'),

  COPY_SUGGESTION_4: shortcutInfo(
    'mod+alt+4', curry(copySuggestionCallback)(4),
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

export function copyFromSourceHandler (event) {
  event.preventDefault()
  return copyFromAlignedSource()
}

/**
 * Generate a callback that will copy one of the suggestions to the editor.
 *
 * @param {number} oneBasedIndex the 1-based index of the suggestion that
 *                               this callback will copy
 * @return {function} callback that will copy the nth suggestion.
 */
function copySuggestionCallback (oneBasedIndex, event) {
  return (dispatch, getState) => {
    if (getState().phrases.selectedPhraseId) {
      event.preventDefault()
      // FIXME dispatch suggestion copy action
    }
  }
}

// FIXME figure out if this is really needed and how to make it work if it is
function saveAsDropdownIsOpen (state) {
  // TODO pahuang is this reliable for checking save as dropdown is open?
  // NO! There is no guarantee that the key is an object
  return state.dropdown.openDropdownKey &&
      typeof state.dropdown.openDropdownKey === 'object'
}

function cancelSaveAsMode () {
  return toggleDropdown(undefined)
}

function cancelSaveAsModeIfOn (dispatch, state) {
  if (saveAsDropdownIsOpen(state)) {
    // TODO pahuang maybe one cancel edit action will do all of below?
    dispatch(cancelSaveAsMode())
  }
}

function cancelEditCallback (event) {
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

function saveAsCurrentButtonOptionCallback (event) {
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    const phrase = getState().phrases.detail[selectedPhraseId]
    const status = getSaveButtonStatus(phrase)
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
function saveAsModeCallback (event) {
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    // const phrase = getState().phrases.detail[selectedPhraseId]
    if (selectedPhraseId) {
      event.preventDefault()
      // FIXME dispatch action for opening "save-as" mode for phrase

      // TODO pahuang open the dropdown for selected phrase
      // dispatch(toggleDropdown())
      // addSaveAsModeExtensionKey(phrase, 'n', 'needsWork')
      // addSaveAsModeExtensionKey(phrase, 't', 'translated')
      // addSaveAsModeExtensionKey(phrase, 'a', 'approved')
    }
  }
}

function saveAs (status) {
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

// TODO pahuang implment these two (first save if unsaved, then move to next,
// then focus the selected phrase)
function gotoNextRowCallback (event) {
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    if (selectedPhraseId) {
      event.preventDefault()
      event.stopPropagation()

      const phrase = getState().phrases.detail[selectedPhraseId]
      if (hasTranslationChanged(phrase)) {
        dispatch(saveAsCurrentButtonOptionCallback(event))
      }
      const docId = getState().data.context.selectedDoc.id
      dispatch(moveNext(docId, selectedPhraseId))
    }
  }
}

function gotoPreviousRowCallback (event) {
  return (dispatch, getState) => {
    const selectedPhraseId = getState().phrases.selectedPhraseId
    if (selectedPhraseId) {
      event.preventDefault()
      event.stopPropagation()
      const phrase = getState().phrases.detail[selectedPhraseId]
      if (hasTranslationChanged(phrase)) {
        dispatch(saveAsCurrentButtonOptionCallback(event))
      }
      const docId = getState().data.context.selectedDoc.id

      dispatch(movePrevious(docId, selectedPhraseId))
    }
  }
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

// FIXME this is not an action, it is just for display. Put it somewhere else.
/**
 * Convert strings like cmd into symbols like ⌘
 * @param  {String} combo Key combination, e.g. 'mod+f'
 * @return {String} The key combination with symbols
 */
export function symbolizeKey (combo) {
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

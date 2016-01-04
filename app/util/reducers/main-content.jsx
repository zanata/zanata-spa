/* Reducer for all main content state
 *
 * This should be made part of the top level reducer when redux
 * is in charge of the whole app
 */

import React from 'react/addons'
import {
  PHRASE_SUGGESTION_COUNT_UPDATED,
  SELECTED_LOCALE_CHANGED,
  SELECTED_TRANS_UNIT_CHANGED,
  SET_SUGGESTION_SEARCH_TYPE,
  SHOW_SUGGESTIONS_CHANGED,
  TOGGLE_DROPDOWN,
  TRANSLATION_TEXT_INPUT_CHANGED,
  TRANS_UNIT_WITH_ID_SELECTION_CHANGED } from 'actions'

export default function (state, action) {
  console.log('handling', action, state)
  switch (action.type) {
    case PHRASE_SUGGESTION_COUNT_UPDATED:
      if (action.id === state.phrase.id) {
        return update({suggestionCount: {$set: action.count}})
      }
      // ignore for now since store only handles 1 phrase
      return state
    case SELECTED_LOCALE_CHANGED:
      return update({translationLocale: {$set: action.locale}})

    case SELECTED_TRANS_UNIT_CHANGED:
      return update({phrase: {$set: action.phrase}})

    case SET_SUGGESTION_SEARCH_TYPE:
      return update({suggestionSearchType: {$set: action.searchType}})

    case SHOW_SUGGESTIONS_CHANGED:
      return update({showSuggestions: {$set: action.show}})

    case TOGGLE_DROPDOWN:
      // if key matches, it is toggling off
      const openDropdown = (action.key === state.openDropdown)
        ? undefined
        : action.key
      return update({openDropdown: {$set: openDropdown}})

    case TRANSLATION_TEXT_INPUT_CHANGED:
      return (action.id === state.phrase.id)
        ? update(
          {
            phrase: {newTranslations: {[action.index]: {$set: action.text}}}
          })
        : state

    case TRANS_UNIT_WITH_ID_SELECTION_CHANGED:
      return (action.id === state.phrase.id)
        ? update({selected: {$set: action.selected}})
        : state

    default:
      console.warn('action was not handled (main-content)', action)
      return state
  }

  function update (commands) {
    return React.addons.update(state, commands)
  }
}

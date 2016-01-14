/* Reducer for all main content state
 *
 * This should be made part of the top level reducer when redux
 * is in charge of the whole app
 */

import React from 'react/addons'
import {
  COPY_FROM_SOURCE,
  PHRASE_SUGGESTION_COUNT_UPDATED,
  PHRASES_TO_DISPLAY,
  SAVE_INITATED,
  SAVE_COMPLETED,
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
    case '@@redux/INIT':
      return state

    case COPY_FROM_SOURCE:
      const { phraseId, sourceIndex } = action
      return update({phrases: {$apply: (phrases) => {
        return phrases.map((phrase) => {
          if (phrase.id !== phraseId) {
            return phrase
          }
          return copyFromSource(phrase, sourceIndex)
        })
      }}})

    case PHRASE_SUGGESTION_COUNT_UPDATED:
      if (action.id === state.phrase.id) {
        return update({suggestionCount: {$set: action.count}})
      }
      // ignore for now since store only handles 1 phrase
      return state

    case PHRASES_TO_DISPLAY:
      // FIXME maybe need to clear selected phrase
      // FIXME this is just a page of phrases,
      //       might want to instead update a cache of
      //       all the phrases, and have paging done by
      //       selecting out the appropriate range.
      //       (fetch based on what is not populated and
      //        what is stale by timestamp or update event)
      return update({phrases: {$set: action.phrases}})

    case SAVE_INITATED:
      return update({
        savingPhraseStatus: {
          $merge: {[action.phraseId]: action.newState}
        }
      })

      // if (state.phrase.id === action.phraseId) {
      //   return update({
      //     isSaving: {$set: true},
      //     savingStatusId: {$set: action.newState}
      //   })
      // }
      // return state

    case SAVE_COMPLETED:
      return update({
        savingPhraseStatus: {
          $merge: {[action.phraseId]: undefined}
        }
      })
      // if (state.phrase.id === action.phraseId) {
      //   return update({
      //     isSaving: {$set: false},
      //     savingStatusId: {$set: undefined}
      //   })
      // }
      // return state

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
      // FIXME instead find and update the phrase with that id
      return update({phrases: {$apply: (phrases) => {
        return phrases.map((phrase) => {
          if (action.id !== phrase.id) {
            return phrase
          }
          return React.addons.update(phrase, {
            newTranslations: {[action.index]: {$set: action.text}}
          })
        })
      }}})
      // return (action.id === state.phrase.id)
      //   ? update(
      //     {
      //       phrase: {newTranslations: {[action.index]: {$set: action.text}}}
      //     })
      //   : state

    case TRANS_UNIT_WITH_ID_SELECTION_CHANGED:
      if (action.selected) {
        return update({selectedPhraseId: {$set: action.id}})
      } else if (state.selectedPhraseId === action.id) {
        return update({selectedPhraseId: {$set: undefined}})
      }
      return state

    default:
      console.warn('action was not handled (main-content)', action)
      return state
  }

  function update (commands) {
    return React.addons.update(state, commands)
  }

  function copyFromSource (phrase, sourceIndex) {
    // FIXME this data must be added to state, this will only
    //       ever copy to first until it is
    const focusedTranslationIndex = 0

    // FIXME use clamp from lodash (when lodash >= 4.0)
    const sourceIndexToCopy =
      sourceIndex < phrase.sources.length
        ? sourceIndex
        : phrase.sources.length - 1
    const sourceToCopy = phrase.sources[sourceIndexToCopy]

    return React.addons.update(phrase, {
      newTranslations: {
        // $splice represents an array of calls to Array.prototype.splice
        // with an array of params for each call
        $splice: [[focusedTranslationIndex, 1, sourceToCopy]]
      }
    })
  }
}

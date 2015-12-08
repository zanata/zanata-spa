/* Reducer for all suggestions state
 *
 * This should be made part of the top level reducer when redux
 * is in charge of the whole app
 */

import React from 'react/addons'
import {
  DIFF_SETTING_CHANGED,
  PHRASE_SUGGESTIONS_UPDATED,
  RESET_SUGGESTIONS_COPYING,
  SET_SUGGESTION_SEARCH_TYPE,
  SHOW_SUGGESTIONS_CHANGED,
  SUGGESTION_FINISHED_COPYING,
  SUGGESTION_SEARCH_TEXT_CHANGE,
  SUGGESTION_STARTED_COPYING,
  TEXT_SUGGESTIONS_UPDATED,
  TRANS_UNIT_SELECTION_CHANGED,
  UI_LOCALE_CHANGED } from 'actions'
import { map } from 'lodash'

export default function (state, action) {
  switch (action.type) {
    case DIFF_SETTING_CHANGED:
      return update({showDiff: {$set: action.showDiff}})

    case RESET_SUGGESTIONS_COPYING:
      // FIXME copying is a boolean on each suggestion
      //       but it should start as false on all of them
      //       when they will be displayed anyway.
      return update({
        phraseSearch: {suggestions:
          {$set: allNotCopying(state.phraseSearch.suggestions)}},
        textSearch: {suggestions:
          {$set: allNotCopying(state.textSearch.suggestions)}}})

    case PHRASE_SUGGESTIONS_UPDATED:
      return update({phraseSearch: {
        loading: {$set: action.loading},
        searchStrings: {$set: action.searchStrings},
        suggestions: {$set: action.suggestions}
      }})

    case SET_SUGGESTION_SEARCH_TYPE:
      return update({searchType: {$set: action.searchType}})

    case SHOW_SUGGESTIONS_CHANGED:
      return update({showPanel: {$set: action.show}})

    case SUGGESTION_FINISHED_COPYING:
      return updateSearchIndexCopying(action.index, false)

    case SUGGESTION_SEARCH_TEXT_CHANGE:
      return update({search: {input: {text: {$set: action.text}}}})

    case SUGGESTION_STARTED_COPYING:
      return updateSearchIndexCopying(action.index, true)

    case TEXT_SUGGESTIONS_UPDATED:
      return update({textSearch: {
        loading: {$set: action.loading},
        searchStrings: {$set: action.searchStrings},
        suggestions: {$set: action.suggestions}
      }})

    case TRANS_UNIT_SELECTION_CHANGED:
      return update({transUnitSelected: {$set: action.selected}})

    case UI_LOCALE_CHANGED:
      return update({locales: {$set: action.localeId}})

    default:
      console.warn('action was not handled', action)
      return state
  }

  function allNotCopying (suggestions) {
    return map(suggestions, (suggestion) => {
      return React.addons.update(suggestion, {copying: {$set: false}})
    })
  }

  /* set copying true or false for an index in the currently active
   * search suggestions */
  function updateSearchIndexCopying (index, copying) {
    if (state.searchType === 'text') {
      return update({textSearch: {suggestions: {$set:
        withIndexCopying(state.textSearch.suggestions, index, copying)
      }}})
    } else {
      return update({phraseSearch: {suggestions: {$set:
        withIndexCopying(state.phraseSearch.suggestions, index, copying)
      }}})
    }
  }

  function withIndexCopying (suggestions, copyingIndex, copying) {
    return map(suggestions, (suggestion, index) => {
      if (index !== copyingIndex) {
        return suggestion
      }
      return React.addons.update(suggestion, {copying: {$set: copying}})
    })
  }

  function update (commands) {
    return React.addons.update(state, commands)
  }
}

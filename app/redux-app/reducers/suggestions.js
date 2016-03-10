import updateObject from 'react-addons-update'

import {
  DIFF_SETTING_CHANGED,
  SET_SUGGESTION_SEARCH_TYPE,
  SUGGESTION_SEARCH_TEXT_CHANGE,
  TEXT_SUGGESTIONS_UPDATED
} from '../actions/suggestions'

const defaultState = {
  // FIXME should be 'phrase' by default
  searchType: 'phrase',
  showDiff: true,
  phraseSearch: {
    loading: false, // service.isLoading(),
    searchStrings: [], // service.getSearchStrings(),
    suggestions: [] // suggestionsWithCopy(service.getResults())
  },
  textSearch: {
    loading: false, // service.isLoading(),
    searchStrings: [], // service.getSearchStrings(),
    suggestions: [] // suggestionsWithCopy(service.getResults())
  },
  search: {
    input: {
      text: '',
      focused: false
    }
  }
}

const suggestions = (state = defaultState, action) => {
  switch (action.type) {
    case DIFF_SETTING_CHANGED:
      return update({showDiff: {$set: !state.showDiff}})

    case SET_SUGGESTION_SEARCH_TYPE:
      return update({searchType: {$set: action.searchType}})

    case SUGGESTION_SEARCH_TEXT_CHANGE:
      return update({search: {input: {text: {$set: action.text}}}})

    case TEXT_SUGGESTIONS_UPDATED:
      return update({textSearch: {
        loading: {$set: action.loading},
        searchStrings: {$set: action.searchStrings},
        suggestions: {$set: action.suggestions}
      }})

    default:
      return state
  }

  /**
   * Apply the given commands to state.
   *
   * Just a shortcut to avoid having to pass state to update over and over.
   */
  function update (commands) {
    return updateObject(state, commands)
  }
}

export default suggestions

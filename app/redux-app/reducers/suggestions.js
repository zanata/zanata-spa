import updateObject from 'react-addons-update'

import {DIFF_SETTING_CHANGED,
    SET_SUGGESTION_SEARCH_TYPE} from '../actions/suggestionsActions'

const defaultState = {
  searchType: 'phrase',
  showDiff: true,
  transUnitSelected: false,
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
    toggle: undefined, // handleToggleSearch,
    clear: undefined, // handleClearSearch,
    changeText: undefined, // handleSearchTextChange,
    input: {
      text: '',
      focused: false
    }
  }
}

const suggestions = (state = defaultState, action) => {
  switch (action.type) {
    case DIFF_SETTING_CHANGED:
      return updateObject(state, {
        showDiff: {
          $set: !state.showDiff
        }
      })
    case SET_SUGGESTION_SEARCH_TYPE:
      return updateObject(state, {
        searchType: {
          $set: action.searchType
        }
      })
  }
  return state
}

export default suggestions

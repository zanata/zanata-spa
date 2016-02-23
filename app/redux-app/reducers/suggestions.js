
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
  return state
}

export default suggestions

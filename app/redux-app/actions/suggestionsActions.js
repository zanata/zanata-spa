export const DIFF_SETTING_CHANGED = Symbol('DIFF_SETTING_CHANGED')
export function diffSettingChanged () {
  return { type: DIFF_SETTING_CHANGED }
}

function changeSearchText (searchText) {
  return (dispatch, getState) => {
    dispatch(suggestionSearchTextChange(searchText))
    dispatch((dispatch, getState) => {
      // TODO implement api call to request text suggestions
      // see TextSuggestionsService
      console.log(
          'REQUEST_TEXT_SUGGESTIONS',
          searchText)
    })
  }
}

export const SET_SUGGESTION_SEARCH_TYPE = 'SET_SUGGESTION_SEARCH_TYPE'
export function setSuggestionSearchType (type) {
  if (type !== 'phrase' && type !== 'text') {
    console.error('invalid search type', type)
  }
  return { type: SET_SUGGESTION_SEARCH_TYPE, searchType: type }
}

export function toggleSearchType () {
  return (dispatch, getState) => {
    const wasTypeText = getState().suggestions.searchType === 'text'

    if (!wasTypeText) {
      changeSearchText('')
    }

    // FIXME transUnitCtrl and mainContentDirective used to listen to this event
    // EventService.emitEvent(
    //    EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
    //    !wasTypeText)
    dispatch(setSuggestionSearchType(wasTypeText ? 'phrase' : 'text'))
  }
}

export const RESET_SUGGESTIONS_COPYING = 'RESET_SUGGESTIONS_COPYING'
export function resetSuggestionsCopying () {
  return { type: RESET_SUGGESTIONS_COPYING }
}

// TODO trigger the actual copy from here when redux is in charge
//      of that part of the component tree
// FIXME this has to live in the directive since the event calls out
//       to angular. Move it back here when possible
// export function copySuggestion (index) {
//   return dispatch => {
//     dispatch(suggestionStartedCopying(index))
//     setTimeout(
//       () => dispatch(suggestionFinishedCopying(index)),
//       500)
//   }
// }

export const SUGGESTION_STARTED_COPYING = 'SUGGESTION_STARTED_COPYING'
export function suggestionStartedCopying (index) {
  return { type: SUGGESTION_STARTED_COPYING, index: index }
}

export const SUGGESTION_FINISHED_COPYING = 'SUGGESTION_FINISHED_COPYING'
export function suggestionFinishedCopying (index) {
  return { type: SUGGESTION_FINISHED_COPYING, index: index }
}

export const PHRASE_SUGGESTIONS_UPDATED = 'PHRASE_SUGGESTIONS_UPDATED'
export function phraseSuggestionsUpdated (
    {loading, searchStrings, suggestions}) {
  return {
    type: PHRASE_SUGGESTIONS_UPDATED,
    loading: loading,
    searchStrings: searchStrings,
    suggestions: suggestions
  }
}

export const PHRASE_SUGGESTION_COUNT_UPDATED =
    'PHRASE_SUGGESTION_COUNT_UPDATED'
export function phraseSuggestionCountUpdated (id, count) {
  return {
    type: PHRASE_SUGGESTION_COUNT_UPDATED,
    id: id,
    count: count
  }
}

export const TEXT_SUGGESTIONS_UPDATED = 'TEXT_SUGGESTIONS_UPDATED'
export function textSuggestionsUpdated ({loading, searchStrings, suggestions}) {
  return {
    type: TEXT_SUGGESTIONS_UPDATED,
    loading: loading,
    searchStrings: searchStrings,
    suggestions: suggestions
  }
}

export const SUGGESTION_SEARCH_TEXT_CHANGE = 'SUGGESTION_SEARCH_TEXT_CHANGE'
export function suggestionSearchTextChange (text) {
  return { type: SUGGESTION_SEARCH_TEXT_CHANGE, text: text }
}




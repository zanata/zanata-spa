import { getSuggestions } from '../api/suggestions'

export const DIFF_SETTING_CHANGED = Symbol('DIFF_SETTING_CHANGED')
export function diffSettingChanged () {
  return { type: DIFF_SETTING_CHANGED }
}

export function clearSearch () {
  return changeSearchText('')
}

export function changeSearchText (searchText) {
  return (dispatch, getState) => {
    dispatch(suggestionSearchTextChange(searchText))
    dispatch(findTextSuggestions(searchText))
  }
}

export const SET_SUGGESTION_SEARCH_TYPE = Symbol('SET_SUGGESTION_SEARCH_TYPE')
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

export const RESET_SUGGESTIONS_COPYING = Symbol('RESET_SUGGESTIONS_COPYING')
export function resetSuggestionsCopying () {
  return { type: RESET_SUGGESTIONS_COPYING }
}

export const COPY_SUGGESTION_N = Symbol('COPY_SUGGESTION_N')
export function copySuggestionN (index) {
  // Decision: keep the logic in here to choose what to copy
  //   reason: reducers are not an easy place to follow complex logic,
  //           they should mainly handle merging data

  return (dispatch, getState) => {
    const { phraseSearch, searchType, textSearch } = getState().suggestions
    const panelVisible = getState().ui.panels.suggestions.visible
    // TODO reusable function to get the current suggestions from state
    //      use here and in component that chooses

    const textSuggestions = panelVisible && searchType === 'text'
    const suggestions = textSuggestions
      ? textSearch.suggestions : phraseSearch.suggestions

    if (suggestions && index < suggestions.length) {
      dispatch(suggestionStartedCopying(index))
      dispatch(copySuggestion(suggestions[index]))
      setTimeout(
        () => dispatch(suggestionFinishedCopying(index)),
        500)
      suggestions[index]
    }

    // if suggestions hidden, copy suggestion at index for selected phrase
    // else copy text or phrase suggestions depending what is visible
  }
}

export const COPY_SUGGESTION = Symbol('COPY_SUGGESTION')
function copySuggestion (suggestion) {
  return { type: COPY_SUGGESTION, suggestion }
}

export const SUGGESTION_STARTED_COPYING = Symbol('SUGGESTION_STARTED_COPYING')
export function suggestionStartedCopying (index) {
  return { type: SUGGESTION_STARTED_COPYING, index: index }
}

export const SUGGESTION_FINISHED_COPYING = Symbol('SUGGESTION_FINISHED_COPYING')
export function suggestionFinishedCopying (index) {
  return { type: SUGGESTION_FINISHED_COPYING, index: index }
}

export const TEXT_SUGGESTIONS_UPDATED = Symbol('TEXT_SUGGESTIONS_UPDATED')
export function textSuggestionsUpdated ({loading, searchStrings, suggestions}) {
  return {
    type: TEXT_SUGGESTIONS_UPDATED,
    loading: loading,
    searchStrings: searchStrings,
    suggestions: suggestions
  }
}

export const SUGGESTION_SEARCH_TEXT_CHANGE =
  Symbol('SUGGESTION_SEARCH_TEXT_CHANGE')
export function suggestionSearchTextChange (text) {
  return { type: SUGGESTION_SEARCH_TEXT_CHANGE, text: text }
}

// TODO change text search to have currentSearch and pendingSearch
export function findTextSuggestions (searchText) {
  return (dispatch, getState) => {
    // TODO also dispatch search timestamp to state
    // TODO stop if this is a repeat of the current search
    // TODO use cached search result if there is a recent one
    //      (alternating 'a' and backspace in textbox would only hit server
    //       once until the cached result for 'a' is old enough to be stale)

    // empty search should immediately return no results and no search strings
    if (!searchText) {
      dispatch(textSuggestionsUpdated({
        loading: false,
        searchStrings: [],
        suggestions: []
      }))
      return
    }

    const searchStrings = [searchText]

    dispatch(textSuggestionsUpdated({
      loading: true,
      searchStrings,
      suggestions: []
    }))

    getSuggestions(searchStrings)
      .then(suggestions => {
        dispatch(textSuggestionsUpdated({
          loading: false,
          searchStrings,
          suggestions
        }))

        // TODO trigger pending search if it exists
      })
      .catch(error => {
        // TODO report error visible to user
        console.error(error)
      })
  }
}

/**
 * Trigger a phrase search using the detail for the given phrase id.
 *
 * When the detail is not available, this will retry evern 0.5 seconds until
 * the detail is present, and will fail after 20 retries.
 *
 * This is needed mainly during document load because phrase selection happens
 * before the detail is available.
 */
export function findPhraseSuggestionsById (phraseId) {
  return (dispatch, getState) => {
    waitForPhraseDetail(20)

    function waitForPhraseDetail (times) {
      const phrase = getState().phrases.detail[phraseId]
      if (phrase) {
        dispatch(findPhraseSuggestions(phrase))
      } else if (times > 0) {
        // FIXME need a better way than polling to trigger this search as soon
        //       as the phrase detail is available.
        setTimeout(() => {
          waitForPhraseDetail(times - 1)
        }, 500)
      } else {
        console.error('No detail available for phrase search after 20 tries. ' +
          'phraseId: ' + phraseId)
      }
    }
  }
}

export function findPhraseSuggestions (phrase) {
  return (dispatch, getState) => {
    const phraseId = phrase.id
    const searchStrings = [...phrase.sources]
    const timestamp = Date.now()

    // TODO return cached results if available and not stale

    // initial state.
    // TODO only set this stuff if it was empty before
    dispatch(phraseSuggestionsUpdated({
      phraseId,
      loading: true,
      searchStrings,
      suggestions: [],
      timestamp
    }))

    getSuggestions(searchStrings)
      .then(suggestions => {
        dispatch(phraseSuggestionsUpdated({
          phraseId,
          loading: false,
          searchStrings,
          suggestions,
          timestamp
        }))
      })
      .catch(error => {
        // TODO report error visible to user
        console.error(error)
      })
  }
}

export const PHRASE_SUGGESTIONS_UPDATED = Symbol('PHRASE_SUGGESTIONS_UPDATED')
export function phraseSuggestionsUpdated (
    {phraseId, loading, searchStrings, suggestions, timestamp}) {
  return {
    type: PHRASE_SUGGESTIONS_UPDATED,
    phraseId,
    loading,
    searchStrings,
    suggestions,
    timestamp
  }
}

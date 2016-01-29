import { fetchPhraseList, fetchPhraseDetail } from '../api'

export const ROUTING_PARAMS_CHANGED = 'ROUTING_PARAMS_CHANGED'
export function routingParamsChanged (newParams) {
  return {
    type: ROUTING_PARAMS_CHANGED,
    params: newParams
  }
}

// a few actions just to coordinate api fetching

export const FETCHING_PHRASE_LIST = 'FETCHING_PHRASE_LIST'

// API lookup of the list of phrase id + phrase status for the current document
export function requestPhraseList (projectSlug, versionSlug, lang, docId) {
  return (dispatch) => {
    dispatch({ type: FETCHING_PHRASE_LIST })

    fetchPhraseList(projectSlug, versionSlug, lang, docId)
      .then(response => {
        if (response.status >= 400) {
          // TODO error detail from actual response object
          dispatch(phraseListFetchFailed(new Error("Failed to fetch phrase list")))
        }
        return response.json()
      })
      .then(statusList => {
        dispatch(phraseListFetched(docId, statusList))
      })
  }
}

// new phrase list has been fetched from API
export const PHRASE_LIST_FETCHED = 'PHRASE_LIST_FETCHED'
export function phraseListFetched (docId, phraseList) {
  return {
    type: PHRASE_LIST_FETCHED,
    docId: docId,
    phraseList: phraseList
  }
}

export const PHRASE_LIST_FETCH_FAILED = 'PHRASE_LIST_FETCH_FAILED'
export function phraseListFetchFailed (error) {
  return { type: PHRASE_LIST_FETCH_FAILED, error: error }
}

export const FETCHING_PHRASE_DETAIL = 'FETCHING_PHRASE_DETAIL'
// API lookup of the detail for a given set of phrases (by id)
export function requestPhraseDetail (localeId, phraseIds) {
  return (dispatch) => {
    dispatch({ type: FETCHING_PHRASE_DETAIL })
    fetchPhraseDetail(localeId, phraseIds)
      .then(response => {
        if (response.status >= 400) {
          // TODO error info from actual response object
          dispatch(phraseDetailFetchFailed(new Error("Failed to fetch phrase detail")))
        }
        return response.json()
      })
      .then(phraseDetail => {
        dispatch(phraseDetailFetched(phraseDetail))
      })
  }
}

// // API lookup of the detail for a set of phrases by id
// export const FETCH_PHRASE_DETAIL = 'FETCH_PHRASE_DETAIL'
// export function fetchPhraseDetail (phraseIds) {
//   return { type: FETCH_PHRASE_DETAIL, phraseIds: phraseIds }
// }

// detail for phrases has been fetched from API
export const PHRASE_DETAIL_FETCHED = 'PHRASE_DETAIL_FETCHED'
export function phraseDetailFetched (phrases) {
  return { type: PHRASE_DETAIL_FETCHED, phrases: phrases }
}

export const PHRASE_DETAIL_FETCH_FAILED = 'PHRASE_DETAIL_FETCH_FAILED'
export function phraseDetailFetchFailed (error) {
  return { type: PHRASE_DETAIL_FETCH_FAILED, error: error }
}


/**
 * Copy from source text to the focused translation input.
 * Only change the input text, not the saved translation value.
 */
export const COPY_FROM_SOURCE = 'COPY_FROM_SOURCE'
export function copyFromSource (phraseId, sourceIndex) {
  return { type: COPY_FROM_SOURCE,
           phraseId: phraseId,
           sourceIndex: sourceIndex
         }
}

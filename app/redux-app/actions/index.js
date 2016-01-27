import { fetchPhraseList } from '../api'

// a few actions just to coordinate api fetching

// API lookup of the list of phrase id + phrase status for the current document
export const FETCHING_PHRASE_LIST = 'FETCHING_PHRASE_LIST'
// FIXME maybe not even use an event type, just do the request with thunk and
//       dispatch the other actions as it goes.
export function requestPhraseList (projectSlug, versionSlug, lang, docId) {
  return (dispatch, getState) => {
    dispatch({ type: FETCHING_PHRASE_LIST })

    fetchPhraseList(projectSlug, versionSlug, lang, docId)
      .then(response => {
        if (response.status >= 400) {
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

// API lookup of the detail for a set of phrases by id
export const FETCH_PHRASE_DETAIL = 'FETCH_PHRASE_DETAIL'
export function fetchPhraseDetail (phraseIds) {
  return { type: FETCH_PHRASE_DETAIL, phraseIds: phraseIds }
}

// detail for phrases has been fetched from API
export const PHRASE_DETAIL_FETCHED = 'PHRASE_DETAIL_FETCHED'
export function phraseDetailFetched (phrases) {
  return { type: PHRASE_DETAIL_FETCHED, phrases: phrases }
}

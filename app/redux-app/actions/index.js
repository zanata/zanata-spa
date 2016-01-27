import { fetchPhraseList } from '../api'

// a few actions just to coordinate api fetching

// API lookup of the list of phrase id + phrase status for the current document
export const FETCHING_PHRASE_LIST = 'FETCHING_PHRASE_LIST'
// FIXME maybe not even use an event type, just do the request with thunk and
//       dispatch the other actions as it goes.
export function requestPhraseList (projectSlug, versionSlug, lang, docId) {
  return (dispatch, getState) => {
    // dispatch an action to indicate fetch is happening
    //  (phrase panel for the doc should show that it is fetching)
    dispatch({ type: FETCHING_PHRASE_LIST })

    // get project+version+doc+locale from getState()
    // FIXME params is passed as props, not available in state
    //       how am I supposed to access it?
    // debugger
    // const state = getState()
    // const location = state.routing.location
    // const query = location.query
    // const projectSlug = query.projectSlug
    // const versionSlug = query.versionSlug
    //
    // console.log(projectSlug, versionSlug)

    // ({ projectSlug, versionSlug, lang, docId } = getState().location.query)

    // start the API call using an imported function
    fetchPhraseList(projectSlug, versionSlug, lang, docId)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Failed to fetch phrase list")
        }
        return response.json()
      })
      .then(statusList => {
        dispatch(phraseListFetched(statusList))
      })
        // I think this line would be redundant, since the keys are
        // already present in an object.
        // .then(json => ({ json, response })))
      // .then(({ json, response }) => {
      //   if (!response.ok) {
      //     // FIXME error condition, dispatch something to indicate failure
      //     //       (or at least completion, inverse of FETCHING_PHRASE_LIST)
      //     console.error('failed to fetch phrase list', json)
      //   }
      //   // assuming this is already in the correct form
      //   dispatch(phraseListFetched(json))
      // })
  }
  return { type: FETCH_PHRASE_LIST }
}

// new phrase list has been fetched from API
export const PHRASE_LIST_FETCHED = 'PHRASE_LIST_FETCHED'
export function phraseListFetched (phraseList) {
  return { type: PHRASE_LIST_FETCHED, phraseList: phraseList }
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

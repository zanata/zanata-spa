import { fetchPhraseList, fetchPhraseDetail, savePhrase } from '../api'
import { toggleDropdown } from '.'
import { mapValues } from 'lodash'

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
          // FIXME should stop executing promise here
        }
        return response.json()
      })
      .then(statusList => {
        dispatch(phraseListFetched(docId, statusList))

        dispatch(requestPhraseDetail(lang, statusList.map(phrase => {
          return phrase.id
        })))
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
      .then(transUnitDetail => {
        dispatch(
          phraseDetailFetched(
            // phraseDetail
            transUnitDetailToPhraseDetail(transUnitDetail, localeId)
          )
        )
      })
  }
}

/**
 * Convert the TransUnit response objects to the Phrase structure that
 * is needed for the component tree.
 */
function transUnitDetailToPhraseDetail (transUnitDetail, localeId) {
  return mapValues(transUnitDetail, (transUnit, id) => {
    const source = transUnit.source
    const plural = source.plural
    const trans = transUnit[localeId]
    const translations = extractTranslations(source, trans)
    return {
      id: parseInt(id, 10),
      plural,
      sources: plural ? source.contents : [source.content],
      translations,
      newTranslations: [...translations],
      status: transUnitStatusToPhraseStatus(trans ? trans.state : undefined),
      revision: trans && trans.revision ? parseInt(trans.revision, 10) : 0,
      wordCount: parseInt(source.wordCount, 10)
    }
  })
}

/**
 * Get translations from a TransUnit in a consistent form (array of strings)
 *
 * This will always return an Array<String>, but the array may be empty.
 */
function extractTranslations (source, trans) {
  if (source.plural) {
    return trans && trans.contents ? trans.contents.slice() : []
  }
  return trans ? [trans.content] : []
}

/**
 * Correct the incoming status keys to match what is expected in
 * the app. No status is assumed to mean new.
 *
 * Expect: untranslated/needswork/translated/approved
 */
function transUnitStatusToPhraseStatus (mixedCaseStatus) {
  const status = mixedCaseStatus
    ? mixedCaseStatus.toLowerCase()
    : undefined
  if (!status || status === 'new') {
    return 'untranslated'
  }
  if (status === 'needreview') {
    return 'needswork'
  }
  // remaining status should be ok just lowercased
  return status
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

/**
 * Stop editing the currently focused phrase and discard all entered text.
 * After this action, no phrase should be in editing state.
 */
export const CANCEL_EDIT = 'CANCEL_EDIT'
export function cancelEdit () {
  return {
    type: CANCEL_EDIT
  }
}

/**
 * Discard all entered text for the currently selected phrase, reverting to
 * whatever translations are currently saved.
 * After this action, a phrase may still be in editing state.
 */
export const UNDO_EDIT = 'UNDO_EDIT'
export function undoEdit () {
  return {
    type: UNDO_EDIT
  }
}

export const SELECT_PHRASE = 'SELECT_PHRASE'
export function selectPhrase (id) {
  return {
    type: SELECT_PHRASE,
    phraseId: id
  }
}


// User has typed/pasted/etc. text for a translation (not saved yet)
export const TRANSLATION_TEXT_INPUT_CHANGED = 'TRANSLATION_TEXT_INPUT_CHANGED'
export function translationTextInputChanged (id, index, text) {
  return {
    type: TRANSLATION_TEXT_INPUT_CHANGED,
    id: id,
    index: index,
    text: text
  }
}

export const SAVE_PHRASE_WITH_STATUS = 'SAVE_PHRASE_WITH_STATUS'
export function savePhraseWithStatus (phrase, status) {
  return (dispatch, getState) => {
    // save dropdowns (and others) should always close when save starts.
    dispatch(toggleDropdown(undefined))

    const stateBefore = getState()
    const saveInfo = {
      localeId: stateBefore.context.lang,
      status,
      translations: phrase.newTranslations
    }

    const inProgressSave =
      stateBefore.phrases.detail[phrase.id].inProgressSave

    if (inProgressSave) {
      dispatch(queueSave(phrase.id, saveInfo))
      // done for now, save will initiate when inProgressSave completes
      return
    }

    doSave(saveInfo)

    /**
     * Perform a save with the given info, and recursively start next save if
     * one has queued when the save finishes.
     */
    function doSave (saveInfo) {
      // fetch a new phrase copy each time so revision and queued saves are
      // are correct.
      const currentPhrase = getState().phrases.detail[phrase.id]
      dispatch(saveInitiated(phrase.id, saveInfo))
      savePhrase(currentPhrase, saveInfo)
        .then(response => {
          if (response.status >= 400) {
            // TODO dispatch an error about save failure
            //      this should remove the inProgressSave data
            dispatch(phraseSaveFailed(currentPhrase, saveInfo))
          } else {
            response.json().then(({ revision, status }) => {
              dispatch(saveFinished(phrase.id, status, revision))
            })
          }
          startPendingSaveIfPresent(currentPhrase)
        })
    }

    function startPendingSaveIfPresent (currentPhrase) {
      const pendingSave = currentPhrase.pendingSave
      if (pendingSave) {
        // TODO this action should move pendingSave to inProgressSave
        // dispatch(initiatedPendingSave(phrase.id))
        doSave(pendingSave)
      }
    }
  }
}

export const QUEUE_SAVE = 'QUEUE_SAVE'
export function queueSave (phraseId, saveInfo) {
  return {
    type: QUEUE_SAVE,
    phraseId,
    saveInfo
  }
}

export const SAVE_INITIATED = 'SAVE_INITIATED'
export function saveInitiated (phraseId, saveInfo) {
  return {
    type: SAVE_INITIATED,
    phraseId,
    saveInfo
  }
}

// FIXME this needs to get the new state into the phrase so that
//       it will display properly
// FIXME should use status and serverStatus to disambiguate
//       (these would be separate types if there were types.)
export const SAVE_FINISHED = 'SAVE_FINISHED'
export function saveFinished (phraseId, transUnitStatus, revision) {
  return {
    type: SAVE_FINISHED,
    phraseId,
    status: transUnitStatusToPhraseStatus(transUnitStatus),
    revision
  }
}

import updateObject from 'react-addons-update'
import {
  CANCEL_EDIT,
  PHRASE_LIST_FETCHED,
  PHRASE_DETAIL_FETCHED,
  SELECT_PHRASE,
  TRANSLATION_TEXT_INPUT_CHANGED,
  UNDO_EDIT
} from '../actions/phrases'
import { mapValues } from 'lodash'

const defaultState = {
  // docId -> list of phrases (id and state)
  inDoc: {},
  // phraseId -> detail
  detail: {},
  selectedPhraseId: undefined
}

const phraseReducer = (state = defaultState, action) => {
  switch (action.type) {
    case CANCEL_EDIT:
      // Discard any newTranslations that were entered.
      return update({
        selectedPhraseId: {$set: undefined},
        detail: {$merge: revertEnteredTranslationsToDefault(state.detail)}
      })
    case PHRASE_LIST_FETCHED:
    // select the first phrase if there is one
      const selectedPhraseId = action.phraseList.length
        ? action.phraseList[0].id
        : undefined
      return update({
        inDoc: {[action.docId]: {$set: action.phraseList}},
        selectedPhraseId: {$set: selectedPhraseId}
      })

    case PHRASE_DETAIL_FETCHED:
      const phrasesWithUiState = mapValues(action.phrases, phrase => {
        console.dir(phrase)
        return updateObject(phrase, {
          isSaving: {$set: false},
          // FIXME check that phrase.translations is the right thing
          newTranslations: {$set: [...phrase.translations]}
        })
      })

      // TODO this shallow merge will lose data from other locales
      //      ideally replace source and locale that was looked up, leaving
      //      others unchanged (depending on caching policy)
      return update({
        detail: {$merge: phrasesWithUiState}
      })

    case SELECT_PHRASE:
      return update({
        selectedPhraseId: {$set: action.phraseId}
      })

    case TRANSLATION_TEXT_INPUT_CHANGED:
      return update({
        phrases: {
          detail: {
            [action.id]: {
              newTranslations: {
                [action.index]: {$set: action.text}
              }
            }
          }
        }
      })

    case UNDO_EDIT:
      // Discard any newTranslations that were entered.
      return update({
        detail: {$merge: revertEnteredTranslationsToDefault(state.detail)}
      })
  }

  return state

  function update (commands) {
    // FIXME update to version that does not lose reference equality when
    //       setting an identical object
    //       see: https://github.com/facebook/react/pull/4968
    return updateObject(state, commands)
  }
}

function revertEnteredTranslationsToDefault (phraseDetails) {
  return phraseDetails.map(phrase => {
    return updateObject(phrase, {
      newTranslations: {$set: [...phrase.translations]}
    })
  })
}

export default phraseReducer

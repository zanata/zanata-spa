import updateState from 'react-addons-update'
import {
  PHRASE_LIST_FETCHED,
  PHRASE_DETAIL_FETCHED
} from '../actions/phrases'

const defaultState = {
  // docId -> list of phrases (id and state)
  inDoc: {},
  // phraseId -> detail
  detail: {}
}

const phraseReducer = (state = defaultState, action) => {
  switch (action.type) {
    case PHRASE_LIST_FETCHED:
      const newState = update({
        inDoc: {[action.docId]: {$set: action.phraseList}}})
      console.dir(newState)
      return newState
      // return update({
      //   inDoc: {[action.docId]: {$set: action.phraseList}}})
    case PHRASE_DETAIL_FETCHED:
      // FIXME need to add some runtime state to the static data
      //  - entered text
      //  - save in progress?
      //      - saving status

      // TODO this shallow merge will lose data from other locales
      //      ideally replace source and locale that was looked up, leaving
      //      others unchanged (depending on caching policy)
      return update({
        detail: {$merge: action.phrases}
      })
  }

  return state

  function update (commands) {
    // FIXME update to version that does not lose reference equality when
    //       setting an identical object
    //       see: https://github.com/facebook/react/pull/4968
    return updateState(state, commands)
  }
}


export default phraseReducer

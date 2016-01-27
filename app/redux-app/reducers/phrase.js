import updateState from 'react-addons-update'
import {
  PHRASE_LIST_FETCHED,
  PHRASE_DETAIL_FETCHED
} from '../actions'

const phraseReducer = (state, action) => {
  switch (action.type) {
    case PHRASE_LIST_FETCHED:
      return update({
        inDoc: {[action.docId]: {$set: action.phraseList}}})
    case PHRASE_DETAIL_FETCHED:
      // TODO this shallow merge will lose data from other locales
      //      ideally replace source and locale that was looked up, leaving
      //      others unchanged (depending on caching policy)
      return update({
        detail: {$merge: action.phrases}
      })
  }

  return state || {
    // docId -> list of phrases (id and state)
    inDoc: {},
    // phraseId -> detail
    detail: {}
  }

  function update (commands) {
    // FIXME update to version that does not lose reference equality when
    //       setting an identical object
    //       see: https://github.com/facebook/react/pull/4968
    return updateState(state, commands)
  }
}


export default phraseReducer

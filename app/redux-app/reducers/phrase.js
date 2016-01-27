
import {
  PHRASE_LIST_FETCHED,
  PHRASE_DETAIL_FETCHED
} from '../actions'

const phraseReducer = (state, action) => {
  switch (action.type) {
    case PHRASE_LIST_FETCHED:
      // replace (or merge?) current phrase list with action.phraseList
      return state // FIXME
    case PHRASE_DETAIL_FETCHED:
      // add/merge/replace each phrase detail in phrases based on id
      return state // FIXME
  }

  return state || "NEED TO IMPLEMENT THIS"
}

export default phraseReducer

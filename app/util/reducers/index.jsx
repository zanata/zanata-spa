
import { merge } from 'lodash'
import { GRAVATAR_URL_UPDATED, TEXTFLOW_COUNTS_UPDATED } from 'actions'

// this should be broken into multiple reducer functions using
// reducer composition
export default function (state, action) {
  switch (action.type) {
    case GRAVATAR_URL_UPDATED:
      return updateState({ data: { user: { gravatarUrl: action.url } } })
    case TEXTFLOW_COUNTS_UPDATED:
      return updateState({
        data: { context: { selectedDoc: { counts: action.counts } } }
      })
    default:
      return state
  }

  /**
   * return a copy of the state with the given changes deeply merged into it
   */
  function updateState (changes) {
    return merge({}, state, changes)
  }
}

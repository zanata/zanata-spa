import stateChangeDispatchMiddleware from './state-change-dispatch'
import { requestDocumentList } from '../actions'
import { requestPhraseList } from '../actions/phrases'

/**
 * Middleware to fetch new data when the context changes.
 *
 * e.g.
 *  - when selected doc ID changes, fetch its text flows
 *  - when the project or version change, fetch a new document list
 */
const fetchDocsMiddleware = stateChangeDispatchMiddleware(
  (dispatch, oldState, newState) => {
    const pre = oldState.context
    const post = newState.context
    const needDocs = pre.projectSlug !== post.projectSlug ||
                     pre.versionSlug !== post.versionSlug
    if (needDocs) {
      dispatch(requestDocumentList())
    }
  },
  (dispatch, oldState, newState) => {
    const needPhrases = oldState.context.docId !== newState.context.docId
    if (needPhrases) {
      const { projectSlug, versionSlug, lang, docId } = newState.context
      dispatch(requestPhraseList(projectSlug, versionSlug, lang, docId))
    }
  }
  // TODO add callback to fetchNewPhrasesIfNeeded (when docId changes)
  // TODO add callback to fetchNewTranslationsIfNeeded (when lang changes)
)

export default fetchDocsMiddleware

import stateChangeDispatchMiddleware from './state-change-dispatch'
import { requestDocumentList } from '../actions'
import { requestPhraseList } from '../actions/phrases'
import { selectDoc, selectLocale } from '../actions/headerActions'

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
      dispatch(selectDoc(docId))
      dispatch(requestPhraseList(projectSlug, versionSlug, lang, docId))
    }
    const updateLocale = oldState.context.lang !== newState.context.lang
    if (updateLocale) {
      const { projectSlug, versionSlug, lang, docId } = newState.context
      dispatch(selectLocale(lang))
      dispatch(requestPhraseList(projectSlug, versionSlug, lang, docId))
    }
  }
)

export default fetchDocsMiddleware

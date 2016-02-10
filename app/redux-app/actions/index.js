import { fetchDocumentList } from '../api'


export const ROUTING_PARAMS_CHANGED = 'ROUTING_PARAMS_CHANGED'
export function routingParamsChanged (newParams) {
  return {
    type: ROUTING_PARAMS_CHANGED,
    params: newParams
  }
}

/**
 * Every dropdown should have a reference-unique key. An empty object is
 * recommended since it is unique with reference equality checks.
 */
export const TOGGLE_DROPDOWN = 'TOGGLE_DROPDOWN'
export function toggleDropdown (dropdownKey) {
  return { type: TOGGLE_DROPDOWN, key: dropdownKey }
}

/**
 * Fetch the list of documents for the current project-version
 */
export function requestDocumentList () {
  return (dispatch, getState) => {
    const { projectSlug, versionSlug } = getState().context

    fetchDocumentList(projectSlug, versionSlug)
    .then(response => {
      if (response.status >= 400) {
        // FIXME dispatch an error saying that document list fetch failed
        console.error('something broke', response);
        // FIXME should stop executing promise here
        return
      }
      return response.json()
    })
    .then(docList => {
      // FIXME dispatch docListFetched
      console.log('got a doc list')
      console.dir(docList)

      // TODO fetch phrases now? Maybe let the update change the selected doc
      //      and fetch phrases in response to changed doc.
    })

  }
}

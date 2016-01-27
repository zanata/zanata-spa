/**
 * Helper functions to make requests on the REST API to a Zanata server
 */

// docs say this needs a promise polyfill?
import fetch from 'isomorphic-fetch'

const baseUrl = 'http://localhost:7878/zanata/rest'

export function fetchPhraseList (projectSlug, versionSlug, localeId, docId) {

  const statusListUrl =
    `${baseUrl}/project/${projectSlug}/version/${versionSlug}/doc/${docId}/status/${localeId}`

  return fetch(statusListUrl, {
    // options
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  })
}

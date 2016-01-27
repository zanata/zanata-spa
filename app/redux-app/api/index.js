/**
 * Helper functions to make requests on the REST API to a Zanata server
 */

// docs say this needs a promise polyfill?
import fetch from 'isomorphic-fetch'

export function fetchPhraseList (projectSlug, versionSlug, localeId, docId) {

  const baseUrl = 'http://localhost:7878/zanata/rest'

  // from UrlService.status
  // '/project/:projectSlug/version/:versionSlug/doc/:docId/status/:localeId'
  const fullUrl = baseUrl + '/project/' + projectSlug +
                            '/version/' + versionSlug +
                            '/doc/' + docId + // FIXME encode
                            '/status/' + localeId

  return fetch(fullUrl, {
    // options
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  })
  // .then handle errors here or elsewhere?
}

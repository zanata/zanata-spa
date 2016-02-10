/**
 * Helper functions to make requests on the REST API to a Zanata server
 */

// The relevant docs for this fetch are at
// https://www.npmjs.com/package/whatwg-fetch
// (it is just a wrapper around whatwg-fetch)
import fetch from 'isomorphic-fetch'

const baseUrl = 'http://localhost:7878/zanata/rest'

export function fetchDocumentList (projectSlug, versionSlug) {
  const docListUrl =
    `${baseUrl}/project/${projectSlug}/version/${versionSlug}/docs`

  return fetch(docListUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  })
}

export function fetchPhraseList (projectSlug, versionSlug, localeId, docId) {

  const statusListUrl =
    `${baseUrl}/project/${projectSlug}/version/${versionSlug}/doc/${docId}/status/${localeId}`

  return fetch(statusListUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  })
}

export function fetchPhraseDetail (localeId, phraseIds) {
  const phraseDetailUrl =
    `${baseUrl}/source+trans/${localeId}?ids=${phraseIds.join(',')}`

  return fetch(phraseDetailUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  })
}


export function savePhrase ({ id, revision, plural },
                            { localeId, status, translations }) {
  const translationUrl = `${baseUrl}/trans/${localeId}`
  return fetch(translationUrl, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({
      id,
      revision, // || 0
      plural,
      content: translations[0],
      contents: translations,
      // TODO also limit to only valid status
      status: phraseStatusToTransUnitStatus(status)
    })
  })
}

/**
 * Convert from lowercase phrase status used in redux app
 * to the caps-case strings used in the REST interface.
 */
function phraseStatusToTransUnitStatus (status) {
  switch (status) {
    case 'untranslated':
      return 'New'
    case 'needswork':
      return 'NeedReview'
    case 'translated':
      return 'Translated'
    case 'approved':
      return 'Approved'
    default:
      console.error('Save attempt with invalid status', status)
  }
}

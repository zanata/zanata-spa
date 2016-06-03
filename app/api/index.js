/**
 * Helper functions to make requests on the REST API to a Zanata server
 */

// The relevant docs for this fetch are at
// https://www.npmjs.com/package/whatwg-fetch
// (it is just a wrapper around whatwg-fetch)
import fetch from 'isomorphic-fetch'
import { encode } from '../utils/doc-id'

// FIXME use value from config
export const serviceUrl = 'http://localhost:7878/zanata'
export const dashboardUrl = serviceUrl + '/dashboard'

// TODO rename to baseRestUrl
export const baseUrl = serviceUrl + '/rest'

export function fetchPhraseList (projectSlug, versionSlug, localeId, docId) {
  const statusListUrl =
    `${baseUrl}/project/${projectSlug}/version/${versionSlug}/doc/${docId}/status/${localeId}` // eslint-disable-line max-len

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

export function fetchStatistics (_projectSlug, _versionSlug,
                                          _docId, _localeId) {
  const statsUrl =
    `${baseUrl}/stats/project/${_projectSlug}/version/${_versionSlug}/doc/${encode(_docId)}/locale/${_localeId}` // eslint-disable-line max-len

  return fetch(statsUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  })
}

export function fetchLocales () {
  // TODO pahuang this was using $location to build up the ui locales
  const uiTranslationsURL = `${baseUrl}/locales`

  return fetch(uiTranslationsURL, {
    method: 'GET'
  })
}

export function fetchMyInfo () {
  const userUrl = `${baseUrl}/user`
  return fetch(userUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'

  })
}

export function fetchProjectInfo (projectSlug) {
  const projectUrl = `${baseUrl}/project/${projectSlug}`
  return fetch(projectUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'

  })
}

export function fetchDocuments (projectSlug, versionSlug) {
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

export function fetchVersionLocales (projectSlug, versionSlug) {
  const localesUrl =
    `${baseUrl}/project/${projectSlug}/version/${versionSlug}/locales`
  return fetch(localesUrl, {
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
      revision,
      plural,
      content: translations[0],
      contents: translations,
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

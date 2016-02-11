// FIXME these are moved temporarily to avoid some messy merge conflicts

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

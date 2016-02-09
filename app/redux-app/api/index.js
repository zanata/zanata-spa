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

function encodeDocId(docId) {
  return docId ? docId.replace(/\//g, ',') : docId
}

export function fetchStatistics(_projectSlug, _versionSlug,
                                          _docId, _localeId) {
  /*
  if (_docId && _localeId) {
    var key = generateStatisticKey(_docId, _localeId)
    if (_.has(statisticMap, key)) {
      return $q.when(statisticMap[key])
    } else {
      var encodedDocId = documentService.encodeDocId(_docId)
      var Statistics = $resource(UrlService.DOC_STATISTIC_URL, {}, {
        query: {
          method: 'GET',
          params: {
            projectSlug: _projectSlug,
            versionSlug: _versionSlug,
            docId: encodedDocId,
            localeId: _localeId
          },
          isArray: true
        }
      })
      return Statistics.query().$promise.then(function (statistics) {
        // Make needReview(server) available to needswork
        _.forEach(statistics, function (statistic) {
          statistic[TransStatusService.getId('needswork')] =
              statistic.needReview || 0
        })

        statisticMap[key] = statistics
        return statisticMap[key]
      })
    }
  }*/
  const statsUrl = `${baseUrl}/stats/project/${_projectSlug}/version/${_versionSlug}/doc/${encodeDocId(_docId)}/locale/${_localeId}`;

  return fetch(statsUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'

  })
}

export function fetchLocales() {
  // TODO pahuang this was using $location to build up the ui locales
  const uiTranslationsURL = `http://localhost:7878/zanata/rest/locales`

  return fetch(uiTranslationsURL, {
    method: 'GET'
  })

}

export function fetchMyInfo() {
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

export function fetchProjectInfo(projectSlug) {
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

export function fetchDocuments(projectSlug, versionSlug) {
  const docListUrl = `${baseUrl}/project/${projectSlug}/version/${versionSlug}/docs`;
  return fetch(docListUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  })
}

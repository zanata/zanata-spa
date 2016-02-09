import {fetchStatistics, fetchLocales, fetchMyInfo, fetchProjectInfo, fetchDocuments} from '../api'
import _ from 'lodash'
import {getId} from '../utils/TransStatusService'
import {equals} from '../utils/StringUtil'

export const TOGGLE_HEADER = 'TOGGLE_HEADER';

export function toggleHeader() {
  return {
    type: TOGGLE_HEADER
  }
}

export const TOGGLE_SUGGESTIONS = 'TOGGLE_SUGGESTIONS';

export function toggleSuggestions() {
  return {
    type: TOGGLE_SUGGESTIONS
  }
}

export const FETCHED_STATISTICS = 'FETCHED_STATISTICS';
export function statisticsFetched(data) {
  return {
    type: FETCHED_STATISTICS,
    data: data
  }
}

export const FETCHING_STATISTICS = 'FETCHING_STATISTICS';

export const FETCH_FAILED = 'FETCH_FAILED'

const fetchFailed = (error) => {
  return {type: FETCH_FAILED, error: error}
};

const unwrapResponse = (errorMsg, response) => {
  if (response.status >= 400) {
    dispatch(fetchFailed(new Error(errorMsg)))
  }
  return response.json()
}

const resolveStats = statistics => {
  // Make needReview(server) available to needswork
  _.forEach(statistics, function (statistic) {
    statistic[getId('needswork')] =
        statistic.needReview || 0
  });

  // TODO local cache
  //statisticMap[key] = statistics
  dispatch(statisticsFetched(
      {
        versionSlug: versionSlug,
        docId: docId,
        counts: statistics
      }))
}

export function fetchStatisticsAction(projectSlug, versionSlug, docId, localeId) {
  return (dispatch, getState) => {
    // TODO pahuang check old state and decide whether we want to call server
    dispatch({type: FETCHING_STATISTICS});
    fetchStatistics(projectSlug, versionSlug, docId, localeId)
        .then(_.curry(unwrapResponse)('fetch statistics failed'))
        .then(resolveStats)

  }
}
export const FETCHING_UI_LOCALES = 'FETCHING_UI_LOCALES'
export const FETCHED_UI_LOCALES = 'FETCHED_UI_LOCALES'

export function uiLocaleFetched(uiLocales) {
  return {
    type: FETCHED_UI_LOCALES,
    data: uiLocales
  }
}

/* convert from structure used in angular to structure used in react */
// TODO we should change the server response to save us from doing this transformation
const prepareLocales = (locales) => {
  return _.chain(locales || [])
      .map(function (locale) {
        return {
          id: locale.localeId,
          name: locale.name
        }
      })
      .indexBy('id')
      .value()
}

const resolveUiLocales = locales => dispatch(uiLocaleFetched(prepareLocales(locales)))

export function fetchUiLocales() {
  return (dispatch) => {
    dispatch({type: FETCHING_UI_LOCALES});
    fetchLocales()
        .then(_.curry(unwrapResponse)('fetch UI locales failed'))
        .then(resolveUiLocales)
  }
}

export const CHANGE_UI_LOCALE = 'CHANGE_UI_LOCALE'

export function changeUiLocale (locale) {
  return {
    type: CHANGE_UI_LOCALE,
    data: locale
  }
}

export const FETCHING = 'FETCHING'

const resolveMyInfo = myInfo => dispatch(myInfoFetched(myInfo))

export function myInfo() {
  return (dispatch) => {
    dispatch({type: FETCHING})
    fetchMyInfo()
        .then(_.curry(unwrapResponse)('fetch my INFO failed'))
        .then(resolveMyInfo)
  }
}

export const MY_INFO_FETCHED = 'MY_INFO_FETCHED'
export function myInfoFetched(myInfo) {
  return {
    type: MY_INFO_FETCHED,
    data: myInfo
  }
}

const resolveProjectInfo = projectInfo => dispath(projectInfoFetched(projectInfo))

export function projectInfo(projectSlug) {
  return (dispath) => {
    fetchProjectInfo(projectSlug)
        .then(_.curry(unwrapResponse)('fetch project info failed'))
        .then(resolveProjectInfo)
  }
}
export const PROJECT_INFO_FETCHED = 'PROJECT_INFO_FETCHED'
export function projectInfoFetched(projectInfo) {
  return {
    type: PROJECT_INFO_FETCHED,
    data: projectInfo
  }
}

const decodeDocId = (docId) => {
  return docId ? docId.replace(/\,/g, '/') : docId
};

const containsDoc = (documents, docId) => {
  return _.any(documents, function (document) {
    return equals(document.name, docId, true)
  })
}

const resolveDocuments = documents => {

  if (!documents || documents.length <= 0) {
    // redirect if no documents in version
    // FIXME implement message Handler
    //MessageHandler.displayError('No documents in ' +
    //    editorCtrl.context.projectSlug + ' : ' +
    //    editorCtrl.context.versionSlug)
    console.error(`No documents in ${projectSlug}:${versionSlug}`)
  } else {
    dispatch(documentListFetched(documents));
    // if docId is not defined in url, set to first from list
    var selectedDocId = getState().data.context.selectedDoc.id;
    if (!selectedDocId) {
      dispatch(selectDoc(documents[0].name));
      // TODO pahuang this is commented out
      //transitionToEditorSelectedView()
    } else {
      let docId = decodeDocId(selectedDocId);
      if (!containsDoc(documents, docId)) {
        dispatch(selectDoc(documents[0].name));
      }
    }
  }
}

export function docList(projectSlug, versionSlug) {
  return (dispatch, getState) => {
    return fetchDocuments(projectSlug, versionSlug)
        .then(_.curry(unwrapResponse)('fetch document list failed'))
  }
}

export const DOCUMENT_LIST_FETCHED = 'DOCUMENT_LIST_FETCHED'
export function documentListFetched(documents) {
  return {
    type: DOCUMENT_LIST_FETCHED,
    data: documents
  }
}

export const DOCUMENT_SELECTED = 'DOCUMENT_SELETED';
export function selectDoc(docId) {
  return {type: DOCUMENT_SELECTED, data: docId}
}

// this is a get all action that will wait until all promises are resovled
export function fetchHeaderInfo(projectSlug, versionSlug, docId, locale) {

  return (dispatch, getState) => {
    let docListPromise = docList(projectSlug, versionSlug).then(_.curry(unwrapResponse)('fetch document list failed')).catch(console.log);
    //let projectInfoPromise = projectInfo(projectSlug).then(_.curry(unwrapResponse)('fetch project info failed')).catch(console.log);
    //let myInfoPromise = fetchMyInfo().then(_.curry(unwrapResponse)('fetch my INFO failed')).catch(console.log);
    //let uiLocalesPromise = fetchLocales().then(_.curry(unwrapResponse)('fetch UI locales failed')).catch(console.log);
    //let statsPromise = fetchStatistics(projectSlug, versionSlug, docId, localeId)
    //    .then(_.curry(unwrapResponse)('fetch statistics failed')).catch(console.log);

    console.log('========== here ');
    Promise.all([docListPromise/*, projectInfoPromise, myInfoPromise, uiLocalesPromise, statsPromise*/])
        .then((all) => {
          let documents = all[0];
          let projectInfo = all[1];
          let myInfo = all[2];
          let locales = all[3];
          let stats = all[4];
          resolveDocuments(documents);
          resolveProjectInfo(projectInfo);
          resolveMyInfo(myInfo);
          resolveUiLocales(locales);
          resolveStats(stats);
        })
        .catch((err) => {
          console.log('==================== oh no!!!!!!!!!!! ====' + err)
        })

  }


}

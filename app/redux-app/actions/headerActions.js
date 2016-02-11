import {fetchStatistics, fetchLocales, fetchMyInfo, fetchProjectInfo, fetchDocuments, fetchVersionLocales} from '../api'
import _ from 'lodash'
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

export const FETCH_FAILED = 'FETCH_FAILED'

const fetchFailed = (error) => {
  return {type: FETCH_FAILED, error: error}
};

const unwrapResponse = (dispatch, errorMsg, response) => {
  if (response.status >= 400) {
    dispatch(fetchFailed(new Error(errorMsg)))
  }
  return response.json()
}

const catchError = (err) => {
  console.error('!!!!!!!!!!!!!!!! BAD !!!!!!!!!!!!!!' + err)
  return {type: FETCH_FAILED, error: err}
}

export const UI_LOCALES_FETCHED = 'UI_LOCALES_FETCHED'
export function uiLocaleFetched(uiLocales) {
  return {
    type: UI_LOCALES_FETCHED,
    data: uiLocales
  }
}
export function fetchUiLocales() {
  return (dispatch) => {
    fetchLocales()
        .then(_.curry(unwrapResponse)(dispatch, 'fetch UI locales failed'))
        .then(uiLocales => dispatch(uiLocaleFetched(uiLocales)))
        .catch(catchError);

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

const decodeDocId = (docId) => {
  return docId ? docId.replace(/\,/g, '/') : docId
};

const hasCaseInsensitiveMatchingProp = (list, prop, matchedValue) => {
  return _.any(list, (item) => {
    return equals(item[prop], matchedValue, true)
  })
}

const containsDoc = (documents, docId) => {
  return hasCaseInsensitiveMatchingProp(documents, 'name', docId);
}

const containsLocale = (localeList, localeId) => {
  return hasCaseInsensitiveMatchingProp(localeList, 'localeId', localeId);
}

export const DOCUMENT_SELECTED = 'DOCUMENT_SELECTED';
export function selectDoc(docId) {
  return {
    type: DOCUMENT_SELECTED,
    data: {
      selectedDocId: docId
    }
  }
}

export const LOCALE_SELECTED = 'LOCALE_SELECTED';
export function selectLocale(localeId) {
  return {
    type: LOCALE_SELECTED,
    data: {
      selectedLocaleId: localeId
    }
  }
}

export const STATS_FETCHED = 'STATS_FETCHED';
export function statsFetched(stats) {
  return {
    type: STATS_FETCHED,
    data: stats
  }
}

export const HEADER_DATA_FETCHED = 'HEADER_DATA_FETCHED';
export function headerDataFetched(data) {
  return {type: HEADER_DATA_FETCHED, data: data}
}

// this is a get all action that will wait until all promises are resovled
export function fetchHeaderInfo(projectSlug, versionSlug, docId, localeId) {

  return (dispatch, getState) => {
    const checkResponse = _.curry(unwrapResponse)(dispatch);

    let docListPromise = fetchDocuments(projectSlug, versionSlug).then(checkResponse('fetch document list failed'));
    let projectInfoPromise = fetchProjectInfo(projectSlug).then(checkResponse('fetch project info failed'));
    let myInfoPromise = fetchMyInfo().then(checkResponse('fetch my INFO failed'));
    let versionLocalesPromise = fetchVersionLocales(projectSlug, versionSlug)
        .then(checkResponse('fetch version locales failed'));

    Promise.all([docListPromise, projectInfoPromise, myInfoPromise, versionLocalesPromise])
        .then((all) => {
          let documents = all[0];
          let projectInfo = all[1];
          let myInfo = all[2];
          let locales = all[3];

          if (!documents || documents.length <= 0) {
            // redirect if no documents in version
            // FIXME implement message Handler
            //MessageHandler.displayError('No documents in ' +
            //    editorCtrl.context.projectSlug + ' : ' +
            //    editorCtrl.context.versionSlug)
            console.error(`No documents in ${projectSlug}:${versionSlug}`)
            return;
          }
          if (!locales || locales.length <= 0) {
            // FIXME implement message Handler
            // redirect if no supported locale in version
            //MessageHandler.displayError('No supported locales in ' +
            //    editorCtrl.context.projectSlug + ' : ' +
            //    editorCtrl.context.versionSlug)
            console.error(`No supported locales in ${projectSlug}:${versionSlug}`)
            return;
          }

          let data = {
            myInfo: myInfo,
            projectInfo: projectInfo,
            versionSlug: versionSlug,
            documents: documents,
            locales: locales
          };

          dispatch(headerDataFetched(data));

          return { documents, locales};
        })
        .then((docsAndLocales) => {
          const {documents, locales} = docsAndLocales;
          // if docId is not defined in url, set it to be the first doc from list
          let selectedDocId = docId || documents[0].name;
          selectedDocId = decodeDocId(selectedDocId);
          if (!containsDoc(documents, selectedDocId)) {
            selectedDocId = documents[0].name;
          }

          // if localeId is not defined in url, set to first from list
          let selectedLocaleId = localeId || locales[0].localeId;
          if (!containsLocale(locales, selectedLocaleId)) {
            selectedLocaleId = locales[0].localeId;
          }

          if (getState().data.context.selectedDoc.id !== selectedDocId || getState().data.context.selectedLocale !== selectedLocaleId) {
            fetchStatistics(projectSlug, versionSlug, selectedDocId, selectedLocaleId)
                .then(checkResponse('fetch statistics failed'))
                .then(stats => dispatch(statsFetched(stats)));
          }

          // dispatching selected doc and locale must happen after we compare previous state otherwise it will not fetch stats
          dispatch(selectDoc(selectedDocId));
          // TODO pahuang this is commented out. implement this
          //transitionToEditorSelectedView()
          dispatch(selectLocale(selectedLocaleId));
        })
        .catch(catchError)

  }


}

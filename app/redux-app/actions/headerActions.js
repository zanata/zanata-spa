import {fetchStatistics, fetchLocales} from '../api'
import _ from 'lodash'
import {getId} from '../utils/TransStatusService'

export const TOGGLE_HEADER = 'TOGGLE_HEADER';

export function toggleHeader(currentVisibility) {
  return {
    type: TOGGLE_HEADER,
    currentVisibility: currentVisibility
  }
}

export const FETCHED_STATISTICS = 'FETCHED_STATISTICS';
export function statisticsFetched(statistics) {
  return {
    type: FETCHED_STATISTICS,
    data: statistics
  }
}

export const FETCHING_STATISTICS = 'FETCHING_STATISTICS';

export const STATISTICS_FETCH_FAILED = 'STATISTICS_FETCH_FAILED'
export function statisticsFetchFailed(error) {
  return {type: STATISTICS_FETCH_FAILED, error: error}
}

export function fetchStatisticsAction(projectSlug, versionSlug, docId, localeId) {
  return (dispatch, getState) => {
    // TODO pahuang check old state and decide whether we want to call server
    dispatch({type: FETCHING_STATISTICS});
    fetchStatistics(projectSlug, versionSlug, docId, localeId)
        .then(response => {
          if (response.status >= 400) {
            // TODO duplicate code for handling ajax error
            dispatch(statisticsFetchFailed(new Error("Failed to fetch statistics")))
          }
          return response.json()
        })
        .then(statistics => {
          // Make needReview(server) available to needswork
          _.forEach(statistics, function (statistic) {
            statistic[getId('needswork')] =
                statistic.needReview || 0
          });

          // TODO local cache
          //statisticMap[key] = statistics
          dispatch(statisticsFetched(statistics))
        })

  }
}
export const FETCHING_UI_LOCALES = 'FETCHING_UI_LOCALES'
export const FETCHED_UI_LOCALES = 'FETCHED_UI_LOCALES'
export const UI_LOCALES_FETCH_FAILED = 'UI_LOCALES_FETCH_FAILED'

export function uiLocalesFetchFailed(error) {
  return {type: UI_LOCALES_FETCH_FAILED, error: error}
}

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

export function fetchUiLocales() {
  return (dispatch) => {
    dispatch({type: FETCHING_STATISTICS});
    fetchLocales().then(response => {
      if (response.status >= 400) {
        // TODO duplicate code for handling ajax error
        dispatch(uiLocalesFetchFailed(new Error("Failed to fetch ui locales")))
      }
      return response.json()
    }).then(locales => {
      dispatch(fetchedUiLocales(prepareLocales(locales)));
    })
  }
}

export const CHANGE_UI_LOCALE = 'CHANGE_UI_LOCALE'

export function changeUiLocale (locale) {
  return {
    type: CHANGE_UI_LOCALE,
    data: locale
  }
}



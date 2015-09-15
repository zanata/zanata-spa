(function () {
  'use strict'

  /**
   * TextSuggestionsService.js
   * @ngInject
   */
  function TextSuggestionsService (_, EventService, SuggestionsService,
                                    $rootScope, $timeout) {
    /* Minimum time in milliseconds to wait between requesting results */
    var DELAY = 300
    var MAX_ACTIVE_REQUESTS = 3

    /* Number of requests that are in progress */
    var activeRequests = 0

    /* @type {string} */
    var searchText = null

    /* @type {Array<Suggestion>} */
    var results = []

    /**
     * @return {boolean} true if results have been requested and not delivered
     */
    function isLoading () {
      return activeRequests > 0
    }

    /**
     *
     * @return {string[]} strings that were used to search, or null if no search
     *                    has been performed.
     */
    function getSearchStrings () {
      return searchText ? [searchText] : []
    }

    /**
     * Get results for the current search
     * @return {Array<Suggestion>} results for the current search. Empty if
     *                             no search has been performed.
     */
    function getResults () {
      return results
    }

    var pendingSearchHandle = null

    /* Time that most recent search was started */
    var latestSearchTimestamp = Date.now()
    var latestResultsTimestamp = Date.now()

    /* Search text for a pending search. Will be overwritten whenever a new
     * search is queued */
    var pendingSearch = null

    /**
     * Make this the next search that will occur when a search is eligible, and
     * ensure that an appropriate timer is running to initiate the pending
     * search.
     *
     * @param {string} text the search text to use when the search is run
     */
    function deferSearch (text) {
      pendingSearch = text
      if (pendingSearchHandle) {
        // timer is already running, no need to start
        return
      }

      // no timer yet, start one
      waitToRunPendingSearch()
    }

    function waitToRunPendingSearch () {
      var eligibleSearchTime = latestSearchTimestamp + DELAY
      var timeUntilCanSearch = eligibleSearchTime - Date.now()

      var delay = timeUntilCanSearch > 0 ? timeUntilCanSearch : DELAY

      pendingSearchHandle = $timeout(function () {
        pendingSearchHandle = null

        if (activeRequests >= MAX_ACTIVE_REQUESTS) {
          // too many requests, keep waiting
          waitToRunPendingSearch()
          return
        }

        // run the actual search
        runPendingSearch()
      }, delay)
    }

    /**
     * Initiate the pending search, and set appropriate variables.
     */
    function runPendingSearch () {
      if (pendingSearch === null) {
        // no pending search, skip
        return
      }

      var search = pendingSearch
      pendingSearch = null
      $timeout.cancel(pendingSearchHandle)
      pendingSearchHandle = null

      searchByText(search)
    }

    /**
     * Perform a search, and set appropriate variables.
     *
     * @param {string} text
     */
    function searchByText (text) {
      searchText = text
      var timestamp = Date.now()
      latestSearchTimestamp = timestamp
      activeRequests++

      // Run the search and notify listeners when it is done
      SuggestionsService.getSuggestionsForText(text).then(
        function (suggestions) {
          // Only update results if this search is more recent than the
          // current results.
          if (timestamp > latestResultsTimestamp) {
            latestResultsTimestamp = timestamp
            results = suggestions
          }
        },
        function (error) {
          console.error('Error searching for text ', error)
        }).finally(function () {
          activeRequests--
          $rootScope.$broadcast('TextSuggestionsService:updated')
          if (activeRequests < MAX_ACTIVE_REQUESTS) {
            runPendingSearch()
          }
        })
    }

    $rootScope.$on(EventService.EVENT.REQUEST_TEXT_SUGGESTIONS,
      function (event, data) {
        if (pendingSearch && pendingSearch === data) {
          // search already pending
          return
        }

        if (!pendingSearch && activeRequests === 0 && searchText === data) {
          // search is identical and there are no other searches to replace it
          return
        }

        // Empty search can update immediately
        if (data === '') {
          searchText = data
          // loading = false
          results = []

          // Ensure that earlier active searches will not overwrite results.
          pendingSearch = null
          $timeout.cancel(pendingSearchHandle)
          pendingSearchHandle = null
          latestSearchTimestamp = Date.now
          latestResultsTimestamp = Date.now()

          $rootScope.$broadcast('TextSuggestionsService:updated')
          return
        }

        if (activeRequests >= MAX_ACTIVE_REQUESTS) {
          // too many requests, queue this one instead
          deferSearch(data)
          return
        }

        var eligibleSearchTime = latestSearchTimestamp + DELAY

        if (Date.now() < eligibleSearchTime) {
          // Too early to search, defer the search
          deferSearch(data)
          return
        }

        results = []
        $rootScope.$broadcast('TextSuggestionsService:updated')
        searchByText(data)
      })

    return {
      isLoading: isLoading,
      getSearchStrings: getSearchStrings,
      getResults: getResults
    }
  }

  angular
    .module('app')
    .factory('TextSuggestionsService', TextSuggestionsService)
})()

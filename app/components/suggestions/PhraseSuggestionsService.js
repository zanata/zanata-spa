(function() {
  'use strict';

  /**
   * PhraseSuggestionsService.js
   * @ngInject
   */
  function PhraseSuggestionsService(_, EventService, SuggestionsService,
                                    $timeout, $rootScope) {
    // TODO extract common code from TextSuggestionsService and here

    /* Minimum time in milliseconds to wait between requesting results */
    var DELAY = 300;
    var MAX_ACTIVE_REQUESTS = 3;

    /* @type {boolean} */
    var loading = false;

    /* @type {Phrase} */
    var searchPhrase = null;

    /* @type {Array<Suggestion>} */
    var results = [];

    /**
     * @return {boolean} true if results have been requested and not delivered
     */
    function isLoading() {
      return loading;
    }

    /**
     *
     * @return {string[]} strings that were used to search, or null if no search
     *                    has been performed.
     */
    function getSearchStrings() {
      return searchPhrase ? searchPhrase.sources : [];
    }

    /**
     * Get results for the current search
     * @return {Array<Suggestion>} results for the current search. Empty if
     *                             no search has been performed.
     */
    function getResults() {
      return results;
    }




    var pendingSearchHandle = null;

    /* Number of requests that are in progress */
    var activeRequests = 0;
    /* Time that most recent search was started */
    var latestSearchTimestamp = Date.now();
    var latestResultsTimestamp = Date.now();

    /* Search data for a pending search. Will be overwritten whenever a new
     * search is queued */
    var pendingSearch = null;

    /**
     * Make this the next search that will occur when a search is eligible, and
     * ensure that an appropriate timer is running to initiate the pending
     * search.
     *
     * @param {Phrase} searchPhrase
     */
    function deferSearch(searchPhrase) {
      pendingSearch = searchPhrase;
      if (pendingSearchHandle) {
        // timer is already running, no need to start
        return;
      }

      // no timer yet, start one
      waitToRunPendingSearch();
    }

    function waitToRunPendingSearch() {
      var eligibleSearchTime = latestSearchTimestamp + DELAY;
      var timeUntilCanSearch = eligibleSearchTime - Date.now();

      var delay = timeUntilCanSearch > 0 ? timeUntilCanSearch : DELAY;

      pendingSearchHandle = $timeout(function () {
        pendingSearchHandle = null;

        if (activeRequests >= MAX_ACTIVE_REQUESTS) {
          // too many requests, keep waiting
          waitToRunPendingSearch();
          return;
        }

        // run the actual search
        runPendingSearch();
      }, delay);
    }

    /**
     * Initiate the pending search, and set appropriate variables.
     */
    function runPendingSearch() {
      if (pendingSearch === null) {
        // no pending search, skip
        return;
      }

      var search = pendingSearch;
      pendingSearch = null;
      $timeout.cancel(pendingSearchHandle);
      pendingSearchHandle = null;

      searchByPhrase(search);
    }

    /**
     * Perform a search, and set appropriate variables.
     *
     * @param {Phrase} phrase
     */
    function searchByPhrase(phrase) {
      searchPhrase = phrase;
      var timestamp = Date.now();
      latestSearchTimestamp = timestamp;
      activeRequests++;

      // Run the search and notify listeners when it is done
      SuggestionsService.getSuggestionsForPhrase(phrase).then(
        function (suggestions) {
          // Only update results if this search is more recent than the
          // current results.
          if (timestamp > latestResultsTimestamp) {
            latestResultsTimestamp = timestamp;
            results = suggestions;
          }
        },
        function (error) {
          console.error('Error searching for phrase ', error);
        }).finally(function () {
          activeRequests--;
          $rootScope.$broadcast('PhraseSuggestionsService:updated');
          if (activeRequests < MAX_ACTIVE_REQUESTS) {
            runPendingSearch();
          }
        });
    }


    $rootScope.$on(EventService.EVENT.REQUEST_PHRASE_SUGGESTIONS,
      function (event, wrapper) {
        /* @type {Phrase} */
        var data = wrapper.phrase;

        if (pendingSearch && pendingSearch.id === data.id) {
          // search already pending
          return;
        }

        if (!pendingSearch && activeRequests === 0 && searchPhrase &&
            searchPhrase.id === data.id) {
          // search is identical and there are no other searches to replace it
          return;
        }

        if (activeRequests >= MAX_ACTIVE_REQUESTS) {
          // too many requests, queue this one instead
          deferSearch(data);
          return;
        }

        var eligibleSearchTime = latestSearchTimestamp + DELAY;

        if (Date.now() < eligibleSearchTime) {
          // Too early to search, defer the search
          deferSearch(data);
          return;
        }

        results = [];
        $rootScope.$broadcast('PhraseSuggestionsService:updated');
        searchByPhrase(data);
      });

    return {
      isLoading: isLoading,
      getSearchStrings: getSearchStrings,
      getResults: getResults
    };
  }

  angular
    .module('app')
    .factory('PhraseSuggestionsService', PhraseSuggestionsService);
})();

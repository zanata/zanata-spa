(function() {
  'use strict';

  /**
   * TextSuggestionsService.js
   * @ngInject
   */
  function TextSuggestionsService(_, EventService, SuggestionsService,
                                    $rootScope, $timeout) {
    /* @type {boolean} */
    var loading = false;

    /* @type {string} */
    var searchText = null;

    /* @type {Array<Suggestion>} */
    var results = [];


    var currentSearchHandle;


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
      return searchText ? [searchText] : [];
    }

    /**
     * Get results for the current search
     * @return {Array<Suggestion>} results for the current search. Empty if
     *                             no search has been performed.
     */
    function getResults() {
      return results;
    }

    $rootScope.$on(EventService.EVENT.REQUEST_TEXT_SUGGESTIONS,
      function (event, data) {

        if (searchText && searchText === data) {
          // Same text, no need to repeat search.
          return;
        }

        // a new search will happen, cancel any pending search
        $timeout.cancel(currentSearchHandle);

        // Empty search can update immediately
        if (data === '') {
          searchText = data;
          loading = false;
          results = [];
          $rootScope.$broadcast('TextSuggestionsService:updated');
          return;
        }

        currentSearchHandle = $timeout(function() {
          // Update everything and notify listeners of the update
          searchText = data;
          loading = true;
          results = [];
          $rootScope.$broadcast('TextSuggestionsService:updated');

          // TODO keep a list of promises for searches that have been started
          // TODO when a more recent search returns, cancel earlier searches

          // Run the search and notify listeners when it is done
          SuggestionsService.getSuggestionsForText(data).then(
            function (suggestions) {
              results = suggestions;
              loading = false;
              $rootScope.$broadcast('TextSuggestionsService:updated');
            },
            function (error) {
              console.error('Error searching for text ', error);
            });
        }, 300);

      });

    return {
      isLoading: isLoading,
      getSearchStrings: getSearchStrings,
      getResults: getResults
    };
  }

  angular
    .module('app')
    .factory('TextSuggestionsService', TextSuggestionsService);
})();

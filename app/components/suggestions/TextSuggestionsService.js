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
      return searchText ? [searchText] : null;
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

        // Empty search should update immediately
        if (data === '') {
          searchText = data;
          loading = false;
          results = [];
          $rootScope.$broadcast('TextSuggestionsService:updated');
          return;
        }

        $timeout.cancel(currentSearchHandle);
        currentSearchHandle = $timeout(function() {
          // Update everything and notify listeners of the update
          searchText = data;
          loading = true;
          results = [];
          $rootScope.$broadcast('TextSuggestionsService:updated');

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

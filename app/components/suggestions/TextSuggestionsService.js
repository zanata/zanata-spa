(function() {
  'use strict';

  /**
   * TextSuggestionsService.js
   * @ngInject
   */
  function TextSuggestionsService(_, EventService, SuggestionsService,
                                    $rootScope) {
    /* @type {boolean} */
    var loading = false;

    /* @type {string} */
    var searchText = null;

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

    // FIXME prevent excessive searches by saving subsequent searches until
    //       after in-progress search, replace the cached search with the latest
    //       search.
    //       May get better use experience by allowing up to 2 or 3 searches at
    //       once, and wait ~500-1000ms before allowing the 2nd or 3rd search to
    //       be sent.
    $rootScope.$on(EventService.EVENT.REQUEST_TEXT_SUGGESTIONS,
      function (event, data) {
        if (searchText && searchText === data) {
          // Same text, no need to repeat search.
          return;
        }

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

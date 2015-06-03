(function() {
  'use strict';

  /**
   * PhraseSuggestionsService.js
   * @ngInject
   */
  function PhraseSuggestionsService(_, EventService, SuggestionsService,
                                    $timeout, $rootScope) {
    /* @type {boolean} */
    var loading = false;

    /* @type {Phrase} */
    var searchPhrase = null;

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

    $rootScope.$on(EventService.EVENT.REQUEST_PHRASE_SUGGESTIONS,
      function (event, data) {
        if (searchPhrase && searchPhrase.id === data.phrase.id) {
          // Same phrase, no need to repeat search.
          return;
        }

        // Update everything and notify listeners of the update
        searchPhrase = data.phrase;
        loading = true;
        results = [];
        $rootScope.$broadcast('PhraseSuggestionsService:updated');

        $timeout.cancel(currentSearchHandle);
        currentSearchHandle = $timeout(function() {
          // Run the search and notify listeners when it is done
          SuggestionsService.getSuggestionsForPhrase(data.phrase).then(
            function (suggestions) {
              results = suggestions;
              loading = false;
              $rootScope.$broadcast('PhraseSuggestionsService:updated');
            },
            function (error) {
              console.error('Error searching for phrase ', error);
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
    .factory('PhraseSuggestionsService', PhraseSuggestionsService);
})();

(function() {
  'use strict';

  /**
   * PhraseSuggestionsService.js
   * @ngInject
   */
  function PhraseSuggestionsService(_, EventService, SuggestionsService,
                                    $rootScope) {
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
      return searchPhrase;// ? searchPhrase.sources : null;
    }

    /**
     * Get results for the current search
     * @return {Array<Suggestion>} results for the current search. Empty if
     *                             no search has been performed.
     */
    function getResults() {
      return results;
    }

    // FIXME prevent exessive searches, use same approach as TextSuggestionsService
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

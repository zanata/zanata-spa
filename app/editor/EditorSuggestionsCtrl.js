(function() {
  'use strict';

  /**
   * EditorSuggestionsCtrl.js
   * @ngInject
   */
  function EditorSuggestionsCtrl(_, SuggestionsService, EventService,
    $rootScope) {
    var editorSuggestionsCtrl = this;

    // Automatic suggestions search on row select
    $rootScope.$on(EventService.EVENT.REQUEST_PHRASE_SUGGESTIONS,
      function (event, data) {
        // TODO send the request for translations

        SuggestionsService.getSuggestionsForPhrase(data.phrase)
          .then(
            // results: array of search results
            // TODO update suggestions type to match
            function (suggestions){
              _.each(suggestions, function (suggestion) {
                console.log('relevance: %f, similarity: %f',
                  suggestion.relevanceScore, suggestion.similarityPercent);
                _.each(suggestion.sourceContents, function (source) {
                  console.log('source: "%s"', source);
                });
                _.each(suggestion.targetContents, function (translation) {
                  console.log('translation: "%s"', translation);
                });
              });
            },
            function (error) {
              console.error('It\'s over! ', error);
            });
      });

    // Manual suggestions search
    $rootScope.$on(EventService.EVENT.REQUEST_TEXT_SUGGESTIONS,
      function (event, data) {
        // TODO send the request for translations

        SuggestionsService.getSuggestionsForText(data)
          .then(
            // results: array of search results that include a phrase
            function (results){
              _.each(results, function (result) {
                _.each(result.phrase.sources, function (source) {
                  console.log('source: "%s"', source);
                });
                _.each(result.phrase.translations, function (translation) {
                  console.log('translation: "%s"', translation);
                });
              });
            },
            function (error) {
              console.error('It\'s over! ', error);
            });
      });

    return editorSuggestionsCtrl;
  }

  angular
    .module('app')
    .controller('EditorSuggestionsCtrl', EditorSuggestionsCtrl);
})();

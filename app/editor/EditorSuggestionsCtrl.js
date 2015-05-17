(function() {
  'use strict';

  /**
   * EditorSuggestionsCtrl.js
   * @ngInject
   */
  function EditorSuggestionsCtrl(_, SuggestionsService, EventService,
    $rootScope) {
    var editorSuggestionsCtrl = this;

    editorSuggestionsCtrl.suggestions = [];

    function displaySuggestions(suggestions) {
      editorSuggestionsCtrl.suggestions = suggestions;
    }

    function handleError (error) {
      console.error('It\'s over! ', error);
    }

    // Automatic suggestions search on row select
    $rootScope.$on(EventService.EVENT.REQUEST_PHRASE_SUGGESTIONS,
      function (event, data) {
        SuggestionsService.getSuggestionsForPhrase(data.phrase)
          .then(displaySuggestions, handleError);
      });

    // Manual suggestions search
    $rootScope.$on(EventService.EVENT.REQUEST_TEXT_SUGGESTIONS,
      function (event, data) {
        SuggestionsService.getSuggestionsForText(data)
          .then(displaySuggestions, handleError);
      });

    return editorSuggestionsCtrl;
  }

  angular
    .module('app')
    .controller('EditorSuggestionsCtrl', EditorSuggestionsCtrl);
})();

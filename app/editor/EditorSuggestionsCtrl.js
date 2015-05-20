(function() {
  'use strict';

  /**
   * EditorSuggestionsCtrl.js
   * @ngInject
   */
  function EditorSuggestionsCtrl($scope, _, SettingsService, SuggestionsService,
    EventService, $rootScope) {
    var SHOW_SUGGESTIONS_SETTING = SettingsService.SETTING.SHOW_SUGGESTIONS;

    var editorSuggestionsCtrl = this;

    editorSuggestionsCtrl.suggestions = [];

    $scope.show = SettingsService.subscribe(SHOW_SUGGESTIONS_SETTING,
      function (show) {
        $scope.show = show;
      });

    editorSuggestionsCtrl.closeSuggestions = function () {
      console.log('about to set show suggestions setting false');
      SettingsService.update(SHOW_SUGGESTIONS_SETTING, false);
    };

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

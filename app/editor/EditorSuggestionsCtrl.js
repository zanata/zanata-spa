(function() {
  'use strict';

  /**
   * EditorSuggestionsCtrl.js
   * @ngInject
   */
  function EditorSuggestionsCtrl($scope, _, SettingsService, SuggestionsService,
    EventService, $rootScope) {
    var SHOW_SUGGESTIONS_SETTING = SettingsService.SETTING.SHOW_SUGGESTIONS;
    var SUGGESTIONS_SHOW_DIFFERENCE_SETTING =
      SettingsService.SETTING.SUGGESTIONS_SHOW_DIFFERENCE;

    var editorSuggestionsCtrl = this;

    editorSuggestionsCtrl.suggestions = [];

    editorSuggestionsCtrl.searchPhrase = null;

    $scope.show = SettingsService.subscribe(SHOW_SUGGESTIONS_SETTING,
      function (show) {
        $scope.show = show;
      });

    $scope.diff = SettingsService.subscribe(SUGGESTIONS_SHOW_DIFFERENCE_SETTING,
      function (diff) {
        $scope.diff = diff;
      });

    editorSuggestionsCtrl.closeSuggestions = function () {
      console.log('about to set show suggestions setting false');
      SettingsService.update(SHOW_SUGGESTIONS_SETTING, false);
    };

    function displaySuggestions(suggestions) {
      editorSuggestionsCtrl.suggestions = _.chain(suggestions)
        .sortBy(['similarityPercent', 'relevanceScore'])
        .reverse()
        .value();
    }

    function handleError (error) {
      console.error('It\'s over! ', error);
    }

    // Automatic suggestions search on row select
    $rootScope.$on(EventService.EVENT.REQUEST_PHRASE_SUGGESTIONS,
      function (event, data) {
        SuggestionsService.getSuggestionsForPhrase(data.phrase)
          .then(displaySuggestions, handleError);
        editorSuggestionsCtrl.searchPhrase = data.phrase;
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

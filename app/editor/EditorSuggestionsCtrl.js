(function() {
  'use strict';

  /**
   * EditorSuggestionsCtrl.js
   * @ngInject
   */
  function EditorSuggestionsCtrl($scope, _, SettingsService, SuggestionsService,
    EventService, $rootScope, $timeout, focus) {
    var SHOW_SUGGESTIONS_SETTING = SettingsService.SETTING.SHOW_SUGGESTIONS;
    var SUGGESTIONS_SHOW_DIFFERENCE_SETTING =
      SettingsService.SETTING.SUGGESTIONS_SHOW_DIFFERENCE;

    var editorSuggestionsCtrl = this;

    editorSuggestionsCtrl.suggestions = [];

    /* @type {string[]} */
    editorSuggestionsCtrl.searchPhrase = null;
    editorSuggestionsCtrl.searchResultsTotal = 0;
    editorSuggestionsCtrl.searchDisplayRequired = false;
    editorSuggestionsCtrl.searchIsText = false;
    editorSuggestionsCtrl.unitSelected = false;
    editorSuggestionsCtrl.searchSugFocused = false;

    $scope.searchIsVisible = false;
    $scope.searchIsLoading = false;

    /**
     * Bound to search text entered by user.
     *
     * I could not get $watch to work with a string, it works in an object.
     */
    $scope.searchInput = { text: '' };
    $scope.$watch('searchInput.text', function (newText) {
      editorSuggestionsCtrl.searchPhrase = [newText];
      editorSuggestionsCtrl.searchForText(newText);
    });

    $scope.show = SettingsService.subscribe(SHOW_SUGGESTIONS_SETTING,
      function (show) {
        $scope.show = show;
      });

    $scope.diff = SettingsService.subscribe(SUGGESTIONS_SHOW_DIFFERENCE_SETTING,
      function (diff) {
        $scope.diff = diff;
      });

    $scope.focusSearch = function($event) {
      if ($event) {
        $event.preventDefault();
      }
      focus('searchSugInput');
    };

    editorSuggestionsCtrl.closeSuggestions = function () {
      SettingsService.update(SHOW_SUGGESTIONS_SETTING, false);
      EventService.emitEvent(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
        false);
    };

    editorSuggestionsCtrl.clearSearchResults =
      function($event, dontFocusInput) {
      // editorSuggestionsCtrl.searchText = '';

        $scope.searchInput.text = '';
        editorSuggestionsCtrl.suggestions = [];
        if (!dontFocusInput && $event) {
          $scope.focusSearch($event);
        }
      };

    editorSuggestionsCtrl.searchForText = function (newText) {
      if (newText.length > 0) {
        $scope.searchIsLoading = true;
      }
      editorSuggestionsCtrl.searchIsText = true;
      $timeout.cancel(editorSuggestionsCtrl.searchInProgress);
      editorSuggestionsCtrl.searchInProgress = $timeout(function() {
        EventService.emitEvent(EventService.EVENT.REQUEST_TEXT_SUGGESTIONS,
          newText);
      }, 300);
    };

    editorSuggestionsCtrl.toggleSearch = function() {
      if ($scope.searchIsVisible) {
        EventService.emitEvent(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
          false);
      }
      else {
        EventService.emitEvent(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
          true);
      }
    };

    // Init
    if (!editorSuggestionsCtrl.unitSelected && $scope.show) {
      editorSuggestionsCtrl.searchDisplayRequired = true;
      showSearch();
    }

    function displaySuggestions(suggestions) {
      var filteredSuggestions = _.chain(suggestions)
        .sortBy(['similarityPercent', 'relevanceScore'])
        .reverse()
        .value();

      if (!editorSuggestionsCtrl.searchIsText) {
        cacheSuggestions(filteredSuggestions);
      }

      if ($scope.searchIsVisible) {
        setPhraseSuggestions(editorSuggestionsCtrl.searchPhrase,
          filteredSuggestions);
        editorSuggestionsCtrl.searchResultsTotal =
          editorSuggestionsCtrl.suggestions.length;
      }
      else {
        setPhraseSuggestions(editorSuggestionsCtrl.currentSearchPhrase,
          filteredSuggestions);
        editorSuggestionsCtrl.searchResultsTotal = 0;
      }

      $scope.searchIsLoading = false;

    }

    function cacheSearchPhrase(searchPhrase) {
      editorSuggestionsCtrl.currentSearchPhrase = searchPhrase;
    }

    function cacheSuggestions(suggestions) {
      editorSuggestionsCtrl.currentPhraseSuggestions = suggestions;
    }

    function setPhraseSuggestions(searchPhrase, suggestions) {
      editorSuggestionsCtrl.searchPhrase = searchPhrase;
      editorSuggestionsCtrl.suggestions = suggestions;
    }

    function restorePhraseSuggestions() {
      $timeout(function() {
        editorSuggestionsCtrl.searchPhrase =
          editorSuggestionsCtrl.currentSearchPhrase;
        editorSuggestionsCtrl.suggestions =
          editorSuggestionsCtrl.currentPhraseSuggestions;
      });
    }

    function hideSearch() {
      $scope.searchIsVisible = false;
      editorSuggestionsCtrl.clearSearchResults(null, true);
      if (editorSuggestionsCtrl.unitSelected) {
        editorSuggestionsCtrl.searchIsText = false;
        restorePhraseSuggestions();
      }
    }

    function showSearch($event, dontFocusInput) {
      $scope.searchInput.text = '';
      $scope.searchIsVisible = true;
      if (!dontFocusInput && $event) {
        $scope.focusSearch($event);
      }
      editorSuggestionsCtrl.searchForText('');
    }

    function handleError (error) {
      console.error('It\'s over! ', error);
    }

    $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT,
      /**
       * @param event
       * @param data {Object}
       */
      function (event, data) {
        editorSuggestionsCtrl.unitSelected = data.id;
        if ($scope.searchInput.text === '' && $scope.searchIsVisible) {
          EventService.emitEvent(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
           false);
        }
        editorSuggestionsCtrl.searchDisplayRequired = false;
      });

    $rootScope.$on(EventService.EVENT.CANCEL_EDIT,
      function () {
        if ($scope.show) {
          showSearch(null, true);
          editorSuggestionsCtrl.searchDisplayRequired = true;
        }
      });

   $rootScope.$on(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
      function(event, activate) {
        if (activate) {
          showSearch(event);
        }
        else {
          hideSearch(event);
        }
      });

    // Automatic suggestions search on row select
    $rootScope.$on(EventService.EVENT.REQUEST_PHRASE_SUGGESTIONS,
      /**
       * @param event
       * @param data {Object}
       */
      function (event, data) {
        $scope.searchIsLoading = true;
        editorSuggestionsCtrl.searchIsText = false;
        SuggestionsService.getSuggestionsForPhrase(data.phrase)
          .then(displaySuggestions, handleError);
        cacheSearchPhrase(data.phrase.sources);
      });

    // Manual suggestions search
    $rootScope.$on(EventService.EVENT.REQUEST_TEXT_SUGGESTIONS,
      /**
       * @param event
       * @param {string} data
       * @return {boolean}
       */
      function (event, data) {
        if (data === '') {
          $scope.searchInput.text = '';
          displaySuggestions([]);
          return false;
        }
        SuggestionsService.getSuggestionsForText(data)
          .then(displaySuggestions, handleError);
        $scope.searchInput.text = data;
      });

    return editorSuggestionsCtrl;
  }

  angular
    .module('app')
    .controller('EditorSuggestionsCtrl', EditorSuggestionsCtrl);
})();

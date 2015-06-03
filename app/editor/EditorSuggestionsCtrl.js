(function() {
  'use strict';

  /**
   * EditorSuggestionsCtrl.js
   * @ngInject
   */
  function EditorSuggestionsCtrl($scope, _, SettingsService,
      PhraseSuggestionsService, TextSuggestionsService, EventService,
      $rootScope, $timeout, focus) {
    var SHOW_SUGGESTIONS_SETTING = SettingsService.SETTING.SHOW_SUGGESTIONS;
    var SUGGESTIONS_SHOW_DIFFERENCE_SETTING =
      SettingsService.SETTING.SUGGESTIONS_SHOW_DIFFERENCE;

    var editorSuggestionsCtrl = this;

    $scope.suggestions = [];
    $scope.hasSuggestions = false;
    $scope.$watch('suggestions.length', function (length) {
      $scope.hasSuggestions = length !== 0;
    });

    /* @type {string[]} */
    $scope.searchStrings = [];
    $scope.hasSearch = false;
    $scope.$watch('searchStrings.length', function (length) {
      $scope.hasSearch = length !== 0;
    });

    // TODO initialize with current trans unit selection state.
    $scope.isTransUnitSelected = false;

    // These must always be opposites. Probably change to an enum.
    $scope.isTextSearch = false;
    $scope.isPhraseSearch = true;

    function setTextSearch(active) {
      $scope.isTextSearch = active;
      $scope.isPhraseSearch = !active;
    }

    $scope.search = {
      isVisible: false,
      isLoading: false,
      input: {
        text: '',
        focused: false
      }
    };

    $scope.$watch('search.input.text', function (newText) {
      editorSuggestionsCtrl.searchForText();
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
        // just remove the text, service will handle updating to empty results.
        $scope.search.input.text = '';

        if (!dontFocusInput && $event) {
          $scope.focusSearch($event);
        }
      };

    editorSuggestionsCtrl.searchForText = function () {
      var newText = $scope.search.input.text;
      if (newText.length > 0) {
        $scope.search.isLoading = true;
      }
      setTextSearch(true);
      EventService.emitEvent(EventService.EVENT.REQUEST_TEXT_SUGGESTIONS,
        newText);
    };

    editorSuggestionsCtrl.toggleSearch = function() {
      if ($scope.search.isVisible) {
        EventService.emitEvent(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
          false);
      }
      else {
        EventService.emitEvent(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
          true);
      }
    };

    // Init
    if ($scope.show && !$scope.isTransUnitSelected) {
      showSearch();
    }

    // TODO move sorting/filtering to suggestion service
    function displaySuggestions(suggestions) {
      var filteredSuggestions = _.chain(suggestions)
        .sortBy(['similarityPercent', 'relevanceScore'])
        .reverse()
        .value();

      $scope.suggestions = filteredSuggestions;
    }

    function hideSearch() {
      $scope.search.isVisible = false;
      setTextSearch(false);
      updatePhraseDisplay();
    }

    function showSearch($event, dontFocusInput) {
      $scope.search.input.text = '';
      $scope.search.isVisible = true;
      if (!dontFocusInput && $event) {
        $scope.focusSearch($event);
      }
      editorSuggestionsCtrl.searchForText();
    }

    $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT,
      /**
       * @param event
       * @param data {Object}
       */
      function (event, data) {
        // Automatically switch back to phrase search when no search is entered
        if ($scope.search.input.text === '' && $scope.search.isVisible) {
          EventService.emitEvent(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
           false);
        }
        $scope.isTransUnitSelected = true;
      });

    $rootScope.$on(EventService.EVENT.CANCEL_EDIT,
      function () {
        $scope.isTransUnitSelected = false;

        if ($scope.show) {
          // FIXME make this not needed, just respond to isTransUnitSelected
          showSearch(null, true);
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
    $rootScope.$on('PhraseSuggestionsService:updated', function () {
      if ($scope.isPhraseSearch) {
        updatePhraseDisplay();
      }
    });

    /**
     * Update all the state to match the latest from the phrase search.
     */
    function updatePhraseDisplay() {
      $scope.searchStrings = PhraseSuggestionsService.getSearchStrings();
      $scope.search.isLoading = PhraseSuggestionsService.isLoading();
      displaySuggestions(PhraseSuggestionsService.getResults());
    }


    // Manual suggestions search
    $rootScope.$on('TextSuggestionsService:updated', function () {
      if ($scope.isTextSearch) {
        updateTextDisplay();
      }
    });

    /**
     * Update all the state to match the latest from the text search service.
     */
    function updateTextDisplay() {
      $scope.searchStrings = TextSuggestionsService.getSearchStrings();
      $scope.search.isLoading = TextSuggestionsService.isLoading();
      displaySuggestions(TextSuggestionsService.getResults());
    }


    return editorSuggestionsCtrl;
  }

  angular
    .module('app')
    .controller('EditorSuggestionsCtrl', EditorSuggestionsCtrl);
})();

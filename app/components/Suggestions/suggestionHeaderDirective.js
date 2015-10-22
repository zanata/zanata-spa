module.exports = function () {
  'use strict'

  var React = require('react')
  var SuggestionsHeader = require('SuggestionsHeader')

  /**
   * @name suggestion-header
   * @description Header of the suggestion panel
   * @ngInject
   */
  function suggestionHeader (SettingsService) {
    return {
      restrict: 'E',
      required: ['editorSuggestions'],
      link: function (scope, element) {
        var editorSuggestions = scope.editorSuggestions
        var DIFF_SETTING =
          SettingsService.SETTING.SUGGESTIONS_SHOW_DIFFERENCE

        SettingsService.subscribe(DIFF_SETTING, render)

        scope.$watch('editorSuggestions.search.isVisible', render)
        scope.$watch('editorSuggestions.isTransUnitSelected', render)
        scope.$watch('editorSuggestions.search.input.text', render)
        scope.$watch('editorSuggestions.search.isLoading', render)
        scope.$watch('editorSuggestions.hasSearch', render)
        scope.$watch('editorSuggestions.suggestions.length', render)

        render()

        function getInitialState () {
          var showDiff = SettingsService.get(DIFF_SETTING)
          var showSearch = editorSuggestions.search &&
            editorSuggestions.search.isVisible
          var transUnitSelected = editorSuggestions.isTransUnitSelected
          var searchText = editorSuggestions.search
            ? editorSuggestions.search.input.text
            : undefined
          var searchLoading = editorSuggestions.search &&
            editorSuggestions.search.isLoading
          var searchExists = editorSuggestions.hasSearch
          var resultCount = editorSuggestions.suggestions.length
          return {
            showDiff: showDiff,
            onDiffChange: handleShowDiffChange,
            transUnitSelected: transUnitSelected,
            closeSuggestions: handleClose,
            search: {
              exists: searchExists,
              show: showSearch,
              toggle: handleToggleSearch,
              text: searchText,
              loading: searchLoading,
              resultCount: resultCount,
              clear: handleClearSearch,
              changeText: handleSearchTextChange
            }
          }
        }

        function handleSearchTextChange (event) {
          scope.$apply(function () {
            // setting state in someone else's scope.
            // probably not good practice, but will take over this
            // with React stuff soon anyway
            editorSuggestions.search.input.text = event.target.value
          })
        }

        function handleShowDiffChange (event) {
          scope.$apply(function () {
            SettingsService.update(DIFF_SETTING, event.target.checked)
          })
        }

        function handleToggleSearch () {
          scope.$apply(function () {
            editorSuggestions.toggleSearch()
          })
        }

        function handleClose () {
          scope.$apply(function () {
            editorSuggestions.closeSuggestions()
          })
        }

        function handleClearSearch () {
          scope.$apply(function () {
            // important to call with no args, to work ok with the angular code
            editorSuggestions.clearSearchResults()
          })
        }

        function render () {
          // just re-generate state to keep it simple,
          // until redux takes over handling state
          var state = getInitialState()

          React.render(
            React.createElement(SuggestionsHeader, state),
            element[0])
        }
      }
    }
  }

  angular
    .module('app')
    .directive('suggestionHeader', suggestionHeader)
}

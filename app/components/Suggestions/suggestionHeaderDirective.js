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

        render()

        function getInitialState () {
          var showDiff = SettingsService.get(DIFF_SETTING)
          var showSearch = editorSuggestions.search &&
            editorSuggestions.search.isVisible
          var transUnitSelected = editorSuggestions.isTransUnitSelected

          return {
            showDiff: showDiff,
            onDiffChange: handleShowDiffChange,
            showSearch: showSearch,
            toggleSearch: handleToggleSearch,
            transUnitSelected: transUnitSelected,
            closeSuggestions: handleClose
          }
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

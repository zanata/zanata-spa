module.exports = function () {
  'use strict'

  var React = require('react')
  // TODO change this as more of the component tree is React
  var SuggestionsPanel = require('SuggestionsPanel')

  /**
   * @name suggestions-panel
   * @description panel with search and display of suggestions
   * @ngInject
   */
  function suggestionsPanel (EventService, SettingsService) {
    return {
      restrict: 'E',
      required: ['editorSuggestions'],
      link: function (scope, element) {
        var editorSuggestions = scope.editorSuggestions
        var DIFF_SETTING =
          SettingsService.SETTING.SUGGESTIONS_SHOW_DIFFERENCE
        var SHOW_SETTING =
          SettingsService.SETTING.SHOW_SUGGESTIONS

        SettingsService.subscribe(DIFF_SETTING, render)
        SettingsService.subscribe(SHOW_SETTING, render)

        // whether a suggestion was copied within the last 0.5 seconds
        // true when copying, false or undefined otherwise
        var copying = []

        // these may work without 'editorSuggestions' prefix, but this code
        // is so temporary that I see no value in checking
        scope.$watch('editorSuggestions.suggestions', resetSuggestionsCopying, true)
        scope.$watch('editorSuggestions.isTransUnitSelected', render)
        scope.$watch('editorSuggestions.search.isLoading', render)
        scope.$watch('editorSuggestions.search.isVisible', render)
        scope.$watch('editorSuggestions.search.input.focused', render)
        scope.$watch('editorSuggestions.search.input.text', render)
        scope.$watch('editorSuggestions.hasSearch', render)
        scope.$watch('editorSuggestions.searchStrings', render, true)
        scope.$watch('editorSuggestions.isTextSearch', render)

        scope.$on('EditorSuggestionsCtrl:nth-suggestion-copied',
          function (event, index) {
            // The actual copy is done in EditorSuggestionsCtrl at the moment
            // (which is where this event is triggered)
            showSuggestionCopying(index)
          })

        render()

        // TODO give this index
        function copySuggestion (index) {
          EventService.emitEvent(EventService.EVENT.COPY_FROM_SUGGESTION,
            { suggestion: editorSuggestions.suggestions[index] })
          showSuggestionCopying(index)
        }

        // renders so that this can be put in watch for suggestions changing
        function resetSuggestionsCopying () {
          copying = []
          render()
        }

        function showSuggestionCopying (index) {
          copying[index] = true
          render()
          setTimeout(function () {
            copying[index] = false
            render()
          }, 500)
        }

        function getInitialState () {

          // from header directive
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



          var showPanel = SettingsService.get(SHOW_SETTING)
          var showSearch = editorSuggestions.search &&
            editorSuggestions.search.isVisible
          var showDiff = SettingsService.get(DIFF_SETTING)

          // these get here by some sort of black magic, presumably
          // or something to do with being somewhere within the purview
          // of EditorSuggestionsCtrl
          var searchStrings = scope.searchStrings
          var suggestions = scope.suggestions
          var searchInputFocused = scope.search.input.focused
          var tuSelected = scope.isTransUnitSelected
          var isTextSearch = scope.isTextSearch

          var suggestionsWithCopy = suggestions.map(function (suggestion, index) {
            return _.assign({}, suggestion, {
              // may be true or undefined
              copying: copying[index] === true,
              copySuggestion: copySuggestion.bind(undefined, index)
            })
          })

          return {
            // TODO move actions to an actions section

            showPanel: showPanel,
            showSearch: showSearch,

            closeSuggestions: handleClose,
            onDiffChange: handleShowDiffChange,
            showDiff: showDiff,
            transUnitSelected: transUnitSelected,
            suggestions: suggestionsWithCopy,
            search: {
              exists: searchExists,
              show: showSearch,
              toggle: handleToggleSearch,
              // the text entered in the input
              text: searchText,
              // the actual search that is being run, could be from 'text'
              // or from a selected TU
              strings: searchStrings,
              loading: searchLoading,
              resultCount: resultCount,
              clear: handleClearSearch,
              changeText: handleSearchTextChange,
              input: {
                focused: searchInputFocused
              },
              isTextSearch: isTextSearch
            },

            // FIXME get from AppCtrl when this directive is out of the
            //       isolated scope of suggestionDirective
            locales: 'en-US',
            // FIXME move to top of component tree
            formats: {
              date: {
                medium: {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }
              }
            }
          }
        }


        /* Helper functions from header directive */

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
            React.createElement(SuggestionsPanel, state),
            element[0])
        }
      }
    }
  }

  angular
    .module('app')
    .directive('suggestionsPanel', suggestionsPanel)
}

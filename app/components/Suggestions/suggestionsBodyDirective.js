module.exports = function () {
  'use strict'

  var React = require('react')
  // TODO change this as more of the component tree is React
  var SuggestionsBody = require('SuggestionsBody')

  /**
   * @name suggestions-body
   * @description content of the suggestion panel
   * @ngInject
   */
  function suggestionsBody (EventService, SettingsService) {
    return {
      restrict: 'E',
      required: ['editorSuggestions'],
      link: function (scope, element) {
        var DIFF_SETTING =
          SettingsService.SETTING.SUGGESTIONS_SHOW_DIFFERENCE

        SettingsService.subscribe(DIFF_SETTING, render)


        // whether a suggestion was copied within the last 0.5 seconds
        // true when copying, false or undefined otherwise
        var copying = []

        // these may work without 'editorSuggestions' prefix, but this code
        // is so temporary that I see no value in checking
        scope.$watch('editorSuggestions.suggestions', resetSuggestionsCopying, true)
        scope.$watch('editorSuggestions.searchStrings', render, true)

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
            { suggestion: scope.editorSuggestions.suggestions[index] })
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
          var showDiff = SettingsService.get(DIFF_SETTING)

          // these get here by some sort of black magic, presumably
          // or something to do with being somewhere within the purview
          // of EditorSuggestionsCtrl
          var search = scope.searchStrings
          var suggestions = scope.suggestions

          var suggestionsWithCopy = suggestions.map(function (suggestion, index) {
            return _.assign({}, suggestion, {
              // may be true or undefined
              copying: copying[index] === true,
              copySuggestion: copySuggestion.bind(undefined, index)
            })
          })

          return {
            suggestions: suggestionsWithCopy,
            // FIXME get from AppCtrl when this directive is out of the
            //       isolated scope of suggestionDirective
            locales: 'en-US',
            showDiff: showDiff,

            // FIXME: undefined. Why?
            search: search,

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

        function render () {
          // just re-generate state to keep it simple,
          // until redux takes over handling state
          var state = getInitialState()

          React.render(
            React.createElement(SuggestionsBody, state),
            element[0])
        }
      }
    }
  }

  angular
    .module('app')
    .directive('suggestionsBody', suggestionsBody)
}

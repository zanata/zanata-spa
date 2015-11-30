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
      // suggestion that is put in the scope in the above directive
      required: ['suggestion', 'search'],
      link: function (scope, element) {
        var suggestion = scope.suggestion
        var search = scope.search
        var DIFF_SETTING =
          SettingsService.SETTING.SUGGESTIONS_SHOW_DIFFERENCE

        SettingsService.subscribe(DIFF_SETTING, render)


        // becomes true for 0.5 seconds after click
        var copying = false

        // first matchDetails determines display type
        scope.$watch('suggestion.matchDetails[0]', render, true)
        scope.$watch('suggestion.similarityPercent', render)
        scope.$watch('search', render, true)

        render()

        function copySuggestion () {
          EventService.emitEvent(EventService.EVENT.COPY_FROM_SUGGESTION,
            { suggestion: suggestion })
          copying = true
          render()
          setTimeout(function () {
            copying = false
            render()
          }, 500)
        }

        function getInitialState () {
          var showDiff = SettingsService.get(DIFF_SETTING)

          return {
            copying: copying,
            copySuggestion: copySuggestion,
            suggestion: suggestion,
            // FIXME get from AppCtrl when this directive is out of the
            //       isolated scope of suggestionDirective
            locales: 'en-US',
            showDiff: showDiff,
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

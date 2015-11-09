module.exports = function () {
  'use strict'

  var React = require('react')
  // TODO change this as more of the component tree is React
  var SuggestionsBody = require('SuggestionMatchPercent')

  /**
   * @name suggestions-body
   * @description content of the suggestion panel
   * @ngInject
   */
  function suggestionsBody () {
    return {
      restrict: 'E',
      // suggestion that is put in the scope in the above directive
      required: ['suggestion'],
      link: function (scope, element) {
        var suggestion = scope.suggestion

        // first matchDetails determines display type
        scope.$watch('suggestion.matchDetails[0]', render, true)
        scope.$watch('suggestion.similarityPercent', render)

        render()

        function getInitialState () {
          return {
            matchType: matchType(suggestion),
            percent: suggestion.similarityPercent
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

        /**
         * Calculate the match type for the suggestion
         */
        function matchType (suggestion) {
          var topMatch = suggestion.matchDetails[0]

          if (topMatch.type === 'IMPORTED_TM') {
            return 'imported'
          }
          if (topMatch.type === 'LOCAL_PROJECT') {
            if (topMatch.contentState === 'Translated') {
              return 'translated'
            }
            if (topMatch.contentState === 'Approved') {
              return 'approved'
            }
          }
          console.error('Unable to generate row display type for top match')
        }
      }
    }
  }

  angular
    .module('app')
    .directive('suggestionsBody', suggestionsBody)
}

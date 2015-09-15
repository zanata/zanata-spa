(function () {
  'use strict'

  /**
   * SuggestionCtrl.js
   * @ngInject
   */
  function SuggestionCtrl (EventService, $rootScope, $scope, _, $timeout) {
    var suggestionCtrl = this

    suggestionCtrl.copyButtonText = 'Copy Translation'

    while ($scope.search.length < $scope.suggestion.sourceContents.length) {
      $scope.search.push('')
    }

    /**
     * Get a modifier for the row class that will determine display colours.
     *
     * Intended to be used to generate css class for the row:
     *
     *     TransUnit--{{suggestionCtrl.rowDisplayType()}}
     *
     * @return {string} modifier to append to the TransUnit-- css class
     */

    suggestionCtrl.rowDisplayType = function () {
      /* @type {MatchDetail} */
      var topMatch = suggestionCtrl.topMatch()

      if (topMatch.type === 'IMPORTED_TM') {
        return 'secondary'
      }
      if (topMatch.type === 'LOCAL_PROJECT') {
        if (topMatch.contentState === 'Translated') {
          return 'success'
        }
        if (topMatch.contentState === 'Approved') {
          return 'highlight'
        }
      }
      console.error('Unable to generate row display type for top match')
    }

    /**
     *
     * @returns {string}
     */
    suggestionCtrl.percentDisplayType = function () {
      var type = suggestionCtrl.rowDisplayType()
      return type.charAt(0).toUpperCase() + type.substring(1)
    }

    /**
     * Return correct percentage to display.
     *
     * I am using this instead of Angular's number display because the number
     * display forces a particular number of decimal places rather than just
     * limiting to the specified number, and because we should never show 100%
     * unless it is exactly 100%.
     */
    suggestionCtrl.percent = function () {
      var percent = parseFloat($scope.suggestion.similarityPercent)

      if (!isFinite(percent)) {
        return null
      }

      // Prevent very high percentages displaying as 100%
      if (percent > 99.99 && percent < 100) {
        return '99.99'
      }
      if (percent >= 99.90 && percent < 100) {
        return '99.9'
      }

      // Limit any inexact percentages to a single decimal place
      if (Math.round(percent) !== percent) {
        return percent.toFixed(1)
      }

      return percent
    }

    /**
     * Return the details for the best match according to the following
     * criteria:
     *
     *  - Content state and type: Approved > Translated > Imported
     *  - Last modified: older modifications take higher priority.
     *
     * @return {MatchDetail} the best match
     */
    suggestionCtrl.topMatch = function () {
      return $scope.suggestion.matchDetails[0]
    }

    suggestionCtrl.showSuggestionCopied = function () {
      suggestionCtrl.copyButtonText = 'Copied'
      suggestionCtrl.copyButtonDisabled = true
      $timeout(function () {
        suggestionCtrl.copyButtonDisabled = false
        suggestionCtrl.copyButtonText = 'Copy Translation'
      }, 500)
    }

    /**
     * Request this suggestion to be copied to the selected translation field.
     *
     * Generates a COPY_FROM_SUGGESTION event.
     */
    suggestionCtrl.copySuggestion = function () {
      suggestionCtrl.showSuggestionCopied()
      EventService.emitEvent(EventService.EVENT.COPY_FROM_SUGGESTION,
        { suggestion: $scope.suggestion })
    }

    $scope.$on('EditorSuggestionsCtrl:nth-suggestion-copied',
      function (event, index) {
        if (index === $scope.index) {
          suggestionCtrl.showSuggestionCopied()
        }
      })

    $scope.detail = suggestionCtrl.topMatch()
    // Will be undefined for imported matches
    $scope.user = $scope.detail.lastModifiedBy || 'Annoymous'
    $scope.remaining = $scope.suggestion.matchDetails.length - 1
    $scope.isTextFlow = $scope.detail.type === 'LOCAL_PROJECT'

    return suggestionCtrl
  }

  angular
    .module('app')
    .controller('SuggestionCtrl', SuggestionCtrl)
})()


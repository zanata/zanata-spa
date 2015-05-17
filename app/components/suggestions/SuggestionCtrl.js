(function () {
  'use strict';

  /**
   * SuggestionCtrl.js
   * @ngInject
   */
  function SuggestionCtrl($scope, _) {
    var suggestionCtrl = this;

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
      var topMatch = suggestionCtrl.topMatch();

      if (topMatch.type === 'IMPORTED_TM') {
        return 'imported';
      }
      if (topMatch.type === 'LOCAL_PROJECT') {
        if (topMatch.contentState === 'Translated') {
          return 'success';
        }
        if (topMatch.contentState === 'Approved') {
          return 'highlight';
        }
      }
      console.error('Unable to generate row display type for top match');
    };

    /**
     *
     * @returns {string}
     */
    suggestionCtrl.percentDisplayType = function () {
      var type = suggestionCtrl.rowDisplayType();
      return type.charAt(0).toUpperCase() + type.substring(1);
    };

    /**
     * Return correct percentage to display.
     *
     * I am using this instead of Angular's number display because the number
     * display forces a particular number of decimal places rather than just
     * limiting to the specified number, and because we should never show 100%
     * unless it is exactly 100%.
     */
    suggestionCtrl.percent = function () {
      var percent = $scope.suggestion.similarityPercent;

      // Prevent very high percentages displaying as 100%
      if (percent > 99.99 && percent < 100) {
        return '99.99';
      }
      if (percent >= 99.90 && percent < 100) {
        return '99.9';
      }

      // Limit any inexact percentages to a single decimal place
      if (Math.round(percent) !== percent) {
        return percent.toFixed(1);
      }

      return percent;
    };

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
      return $scope.sortedDetails[0];
    };

    // TODO use sortByAll when lodash version is increased
    /**
     * Return a string that will naturally sort local project details before
     * imported TM details, approved state above translated state, and older
     * modification dates first, in that priority order.
     *
     * @param detail {MatchDetail} to generate a sorting string for
     * @returns {string}
     */
    function typeAndDateSort (detail) {

      if (detail.type === 'IMPORTED_TM') {
        return '3' + detail.lastChanged;
      }
      if (detail.type === 'LOCAL_PROJECT') {
        if (detail.contentState === 'Translated') {
          return '2' + detail.lastModifiedDate;
        }
        if (detail.contentState === 'Approved') {
          return '1' + detail.lastModifiedDate;
        }
      }
      // Unrecognized, sort last
      return '9';
    }

    // TODO sort detail before it is sent here for display
    $scope.sortedDetails =
      _.sortBy($scope.suggestion.matchDetails, typeAndDateSort);


    // Will be undefined for imported matches
    $scope.translator = suggestionCtrl.topMatch().lastModifiedBy;



    return suggestionCtrl;
  }

  angular
    .module('app')
    .controller('SuggestionCtrl', SuggestionCtrl);
})();


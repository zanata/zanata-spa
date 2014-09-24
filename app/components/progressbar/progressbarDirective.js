(function() {
  'use strict';

  /**
   * @name progressbar
   * @description progressbar container
   * @ngInject
   */
  function progressbar() {
    return {
      restrict: 'E',
      required: 'progressbarStatistic',
      scope: {
        statistic: '=progressbarStatistic',
        size: '@' //large, full, or empty
      },
      templateUrl: 'components/progressbar/progressbar.html',
      controller: function($scope) {
        /**
         * Need to set to true for complex object watch. Performance issue.
         * https://docs.angularjs.org/api/ng/type/$rootScope.Scope
         */
        $scope.$watch('statistic', function(statistic) {
          if (statistic) {
            $scope.style = getStyle(statistic);
          }
        }, true);
      }
    };
  }

  function getStyle(statistic) {
    var total = statistic.total,
        widthApproved = getWidthPercent(statistic.approved, total),
        widthTranslated = getWidthPercent(statistic.translated, total),
        marginLeftTranslated = widthApproved,
        widthNeedsWork = getWidthPercent(statistic.needsWork, total),
        marginLeftNeedsWork = widthApproved + widthTranslated,
        widthUntranslated = getWidthPercent(statistic.untranslated, total),
        marginLeftUntranslated = widthApproved +
          widthTranslated + widthNeedsWork,
        style = {};

    style.approved = {
      'width': widthApproved + '%',
      'marginLeft': 0
    };
    style.translated = {
      'width': widthTranslated + '%',
      'marginLeft': marginLeftTranslated + '%'
    };
    style.needsWork = {
      'width': widthNeedsWork + '%',
      'marginLeft': marginLeftNeedsWork + '%'
    };
    style.untranslated = {
      'width': widthUntranslated + '%',
      'marginLeft': marginLeftUntranslated + '%'
    };
    return style;
  }

  function getWidthPercent(value, total) {
    var percent = 0;
    if (value) {
      percent = value / total * 100;
    }
    return percent;
  }

  angular
    .module('app')
    .directive('progressbar', progressbar);

})();

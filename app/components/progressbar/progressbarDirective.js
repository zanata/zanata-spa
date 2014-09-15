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
      replace: true,
      required: 'progressbarStatistic',
      scope: {
        progressbarStatistic: '=',
        size: '@' //large, full, or empty
      },
      templateUrl: 'components/progressbar/progressbar.html',
      link: function(scope, element, attr) {
        scope.$watch('progressbarStatistic', function(statistic) {
          if (statistic) {
            scope.style = getStyle(statistic);
          }
        });
        scope.size = attr.size;
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

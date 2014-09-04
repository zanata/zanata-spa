(function() {
  'use strict';

  /**
   * @name progressbar
   * @description progressbar container
   * @ngInject
   */
  function progressbar() {
    return {
      restrict : 'A',
      replace : true,
      required : 'progressbarStatistic',
      scope : {
        progressbarStatistic : '=',
        size : '@' //large, full, or empty
      },
      controller : [ '$scope', '$element', '$attrs',
          function($scope, $element) {
            if($scope.size) {
              switch($scope.size) {
                case 'large':
                  $element.addClass('progress-bar--large');
                  break;
                case 'full':
                  $element.addClass('progress-bar--full');
                  break;
                default:
                //
              }
            }
            if ($scope.progressbarStatistic) {
               $scope.style = getStyle(
                 $scope.progressbarStatistic);
            }
          } ],
      templateUrl : 'components/progressbar/progressbar.html',
      link: function(scope) {
        scope.$watch('progressbarStatistic', function(statistic) {
          if (statistic) {
            scope.style = getStyle(statistic);
          }
        });
      }
    };
  }

  function getStyle(statistic) {
    var style = {};

    var total = statistic.total;

    var widthApproved = getWidthPercent(statistic.approved, total);

    var widthTranslated = getWidthPercent(statistic.translated, total);
    var marginLeftTranslated = widthApproved;

    var widthNeedsWork = getWidthPercent(statistic.needsWork, total);
    var marginLeftNeedsWork = widthApproved + widthTranslated;

    var widthUntranslated = getWidthPercent(statistic.untranslated, total);
    var marginLeftUntranslated = widthApproved +
      widthTranslated + widthNeedsWork;

    style.approved = {
      'width' : widthApproved + '%',
      'marginLeft' : 0
    };
    style.translated = {
      'width' : widthTranslated + '%',
      'marginLeft' : marginLeftTranslated + '%'
    };
    style.needsWork = {
      'width' : widthNeedsWork + '%',
      'marginLeft' : marginLeftNeedsWork + '%'
    };
    style.untranslated = {
      'width' : widthUntranslated + '%',
      'marginLeft' : marginLeftUntranslated + '%'
    };
    return style;
  }

  function getWidthPercent(value, total) {
    return value / total * 100;
  }

  angular.module('app').directive('progressbar', progressbar);
})();

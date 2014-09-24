(function() {
  'use strict';

  /**
   * @name scroll
   * @description scroll container
   * @ngInject
   */
  function scroll($timeout) {
    return {
      restrict: 'AE',
      required: ['scrollNextHandler', 'scrollPreviousHandler'],
      scope: {
        scrollNextHandler: '&',
        scrollPreviousHandler: '&',
        scrollThreshold: '@',
        timeThreshold: '@'
      },
      link: function (scope, element) {
        var
          lengthThreshold = scope.scrollThreshold ||
            element[0].clientHeight / 2,
          timeThreshold = scope.timeThreshold || 400,
          promise = null,
          lastRemaining = 400;

        lengthThreshold = parseInt(lengthThreshold, 10);
        timeThreshold = parseInt(timeThreshold, 10);

        element.bind('scroll', function () {
          var remaining = element[0].scrollHeight - (element[0].clientHeight +
              element[0].scrollTop);

          //if we have reached the threshold and we scroll down
          if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

            //if there is already a timer running which has no expired yet
            // we have to cancel it and restart the timer
            if (promise !== null) {
              $timeout.cancel(promise);
            }
            promise = $timeout(function () {
              scope.$apply(scope.scrollNextHandler());
              promise = null;
            }, timeThreshold);
          }
          lastRemaining = remaining;
        });
      }
    };
  }

  angular
    .module('app')
    .directive('scroll', scroll);

})();

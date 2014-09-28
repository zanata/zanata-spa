(function() {
  'use strict';

  /**
   * @name scroll
   * @description scroll container
   * @ngInject
   */

  //TODO: insert a div for fix height when scroll down
  //TODO: handle scroll up event (load previous data)
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
          lastRemaining = 400,
          lastScrollTop = 0;

        lengthThreshold = parseInt(lengthThreshold, 10);
        timeThreshold = parseInt(timeThreshold, 10);

        element.bind('scroll', function () {
          var scrollTop = element[0].scrollTop;
          var remainingBottom = element[0].scrollHeight -
            (element[0].clientHeight + scrollTop);

          if(scrollTop > lastScrollTop) {
            //if we have reached the threshold and we scroll down
            if (remainingBottom < lengthThreshold && (remainingBottom -
              lastRemaining) < 0) {
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
          } else {
            // scrolling upwards

            //if firstChild.scrollTop+height < threshold
            // (scrollTop - paddedHeight)
//            if (promise !== null) {
//              $timeout.cancel(promise);
//            }
//            promise = $timeout(function () {
//              scope.$apply(scope.scrollPreviousHandler());
//              promise = null;
//            }, timeThreshold);
          }


          lastScrollTop = scrollTop;
          lastRemaining = remainingBottom;
        });
      }
    };
  }

  angular
    .module('app')
    .directive('scroll', scroll);

})();

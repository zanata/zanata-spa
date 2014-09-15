(function() {
  'use strict';

  /**
   * @name clickElsewhere
   * @description Initiate expression when clicking somewhere else
   * @ngInject
   */
  function clickElsewhere($document) {
    return {
      restrict: 'A',
      scope: {
        callback: '&clickElsewhere'
      },
      link: function(scope, element) {
        var handler = function(e) {
          if (!element[0].contains(e.target)) {
            scope.$apply(scope.callback(e));
          }
        };

        $document.on('click', handler);

        scope.$on('$destroy', function() {
          $document.off('click', handler);
        });
      }
    };
  }

  angular
    .module('app')
    .directive('clickElsewhere', clickElsewhere);

})();

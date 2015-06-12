(function() {
  'use strict';

  /**
   * @name blur-on
   * @description When you put attribute 'blur-on="something"',
   * you can then blur this element. It works the same way as focus-on library.
   */
  function blurOn() {
    return {
      restrict: 'A',
      link: function(scope, elem, attr) {
        return scope.$on('blurOn', function (e, name) {
          if (name === attr.blurOn) {
            return elem[0].blur();
          }
        });
      }
    };
  }

  angular
    .module('app')
    .directive('blurOn', blurOn);

})();

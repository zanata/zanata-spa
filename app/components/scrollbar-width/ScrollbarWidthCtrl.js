(function() {
  'use strict';

  /**
   * @name ScrollbarWidthCtrl
   *
   * @description
   * Handle dropdown events between directives
   *
   * @ngInject
   */
  function ScrollbarWidthCtrl() {
    var scrollbarWidthCtrl = this;

    scrollbarWidthCtrl.init = function() {
      var container = scrollbarWidthCtrl.container[0],
        child = scrollbarWidthCtrl.child[0],
        scrollbarWidth = child.offsetWidth - container.offsetWidth;

      scrollbarWidthCtrl.width = scrollbarWidth / 2;
    };

  }

  angular
    .module('app')
    .controller('ScrollbarWidthCtrl', ScrollbarWidthCtrl);

})();

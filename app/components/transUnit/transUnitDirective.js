(function() {
  'use strict';

  /**
   * @name trans-unit
   * @description transUnit container
   * @ngInject
   */
  function transUnit() {
    return {
      restrict: 'E',
      required: ['phrase', 'editorContext'],
      scope: {
        phrase: '=',
        firstPhrase: '=',
        editorContext: '='
      },
      controller: 'TransUnitCtrl as transUnitCtrl',
      templateUrl: 'components/transUnit/trans-unit.html',
      link: function(scope, element, attr, TransUnitCtrl) {
        TransUnitCtrl.init();
      }
    };
  }

  angular
    .module('app')
    .directive('transUnit', transUnit);
})();

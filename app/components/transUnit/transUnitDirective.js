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
    .directive('transUnit', transUnit);
})();

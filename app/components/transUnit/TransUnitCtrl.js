(function () {
  'use strict';

  /**
   * TransUnitCtrl.js
   * @ngInject
   */
  function TransUnitCtrl($scope, $element, EventService) {
    $scope.selected = false;

    var onTransUnitClick = function (event) {
      event.preventDefault();
      $scope.$apply(function () {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
          $scope, $scope);
      });
    };

    $element.bind('click', onTransUnitClick);

    $scope.$on('$destroy', function () {
      $element.unbind('click', onTransUnitClick);
    });

    return this;
  }

  angular
    .module('app')
    .controller('TransUnitCtrl', TransUnitCtrl);
})();

(function () {
  'use strict';

  /**
   * TransUnitCtrl.js
   * @ngInject
   */
  function TransUnitCtrl($scope, $stateParams, $element,
                         TransUnitService, EventService) {
    var transUnitCtrl = this;
    transUnitCtrl.selected = false;

    transUnitCtrl.getPhrase = function() {
      return $scope.phrase;
    };


    transUnitCtrl.init = function() {
      TransUnitService.addController($scope.phrase.id, transUnitCtrl);
      if($stateParams.tuId && $stateParams.selected &&
        parseInt($stateParams.tuId) === $scope.phrase.id) {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
          {'id': $stateParams.tuId,
            'updateURL': false}, null);
      }
    };

    $element.bind('click', onTransUnitClick);

    $scope.$on('$destroy', function () {
      $element.unbind('click', onTransUnitClick);
    });

    function onTransUnitClick(event) {
      event.preventDefault();
      $scope.$apply(function () {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
          {'id': $scope.phrase.id,
            'updateURL': true}, $scope);
      });
    }
    return transUnitCtrl;
  }

  angular
    .module('app')
    .controller('TransUnitCtrl', TransUnitCtrl);
})();

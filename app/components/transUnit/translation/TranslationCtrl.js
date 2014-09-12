(function () {
  'use strict';

  /**
   * TranslationCtrl.js
   * @ngInject
   */
  function TranslationCtrl($scope, EventService) {

    $scope.copySource = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.COPY_FROM_SOURCE,
        $scope.phrase, $scope);
    };

    $scope.cancelEdit = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.CANCEL_EDIT,
        $scope, $scope);
    };

    return this;
  }

  angular
    .module('app')
    .controller('TranslationCtrl', TranslationCtrl);
})();

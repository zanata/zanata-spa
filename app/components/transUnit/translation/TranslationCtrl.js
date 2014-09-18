(function () {
  'use strict';

  /**
   * TranslationCtrl.js
   * @ngInject
   */
  function TranslationCtrl($scope, TransUnitService, EventService) {
    var translationCtrl = this;

    translationCtrl.copySource = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.COPY_FROM_SOURCE,
        $scope.phrase, $scope);
    };

    translationCtrl.cancelEdit = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.CANCEL_EDIT,
        $scope.phrase, $scope);
    };

    translationCtrl.saveAsTranslated = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
        { 'phrase' : $scope.phrase,
          'status': TransUnitService.TU_STATUS.TRANSLATED
        }, $scope);
    };

    translationCtrl.saveAsFuzzy = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
        { 'phrase' : $scope.phrase,
          'status': TransUnitService.TU_STATUS.NEED_REVIEW
        }, $scope);
    };

    translationCtrl.saveAsApproved = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
        { 'phrase' : $scope.phrase,
          'status': TransUnitService.TU_STATUS.APPROVED
        }, $scope);
    };

    return translationCtrl;
  }

  angular
    .module('app')
    .controller('TranslationCtrl', TranslationCtrl);
})();

(function () {
  'use strict';

  /**
   * TranslationCtrl.js
   * @ngInject
   */
  function TranslationCtrl($scope, $stateParams, TransUnitService,
                           EventService, LocaleService) {
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
          'state'  : TransUnitService.TU_STATE.TRANSLATED,
          'locale' : $stateParams.localeId,
          'docId'  : $stateParams.docId
        }, $scope);
    };

    translationCtrl.saveAsNeedsWork = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
        { 'phrase'  : $scope.phrase,
          'state'  : TransUnitService.TU_STATE.NEED_REVIEW,
          'locale' : $stateParams.localeId,
          'docId'  : $stateParams.docId
        }, $scope);
    };

    translationCtrl.saveAsApproved = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
        { 'phrase' : $scope.phrase,
          'state': TransUnitService.TU_STATE.APPROVED,
          'locale' : $stateParams.localeId,
          'docId'  : $stateParams.docId
        }, $scope);
    };

    translationCtrl.getLocaleDisplayName = function(localeId) {
      return LocaleService.getDisplayName(localeId);
    };

    return translationCtrl;
  }

  angular
    .module('app')
    .controller('TranslationCtrl', TranslationCtrl);
})();

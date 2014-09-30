(function () {
  'use strict';

  /**
   * TransUnitCtrl.js
   * @ngInject
   */
  function TransUnitCtrl($scope, $element, $stateParams, $filter, _,
      TransUnitService, EventService, LocaleService) {

    var transUnitCtrl = this;

    transUnitCtrl.selected = false;
    transUnitCtrl.saveStatus = TransUnitService.getSaveStatus($scope.phrase);
    transUnitCtrl.saveOptions =
      TransUnitService.getSaveOptions(transUnitCtrl.saveStatus);

    transUnitCtrl.isTranslationModified =
      TransUnitService.isTranslationModified;

    transUnitCtrl.updateSaveStatus = function(phrase) {
      // TODO: Move to an event… Maybe?
      transUnitCtrl.saveStatus = TransUnitService.getSaveStatus(phrase);
      transUnitCtrl.saveOptions =
        TransUnitService.getSaveOptions(transUnitCtrl.saveStatus);
    };

    transUnitCtrl.getPhrase = function() {
      return $scope.phrase;
    };

    transUnitCtrl.init = function() {
      TransUnitService.addController($scope.phrase.id, transUnitCtrl);
      if($stateParams.id && parseInt($stateParams.id) === $scope.phrase.id) {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
          {'id': $stateParams.id,
            'updateURL': false,
            'focus' : $stateParams.selected}, null);
      }
    };

    transUnitCtrl.copySource = function($event, phrase) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.COPY_FROM_SOURCE,
        phrase, $scope);
      // TODO: Move to an event
      transUnitCtrl.updateSaveStatus(phrase);
    };

    transUnitCtrl.undoEdit = function($event, phrase) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.UNDO_EDIT,
        phrase, $scope);
      // TODO: Move to an event
      transUnitCtrl.updateSaveStatus(phrase);
    };

    transUnitCtrl.cancelEdit = function($event, phrase) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.CANCEL_EDIT,
        phrase, $scope);
    };

    transUnitCtrl.saveAs = function($event, status) {
      $event.stopPropagation(); //prevent click event of TU
      console.log(status);
      EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
        { 'phrase' : $scope.phrase,
          'status' : status,
          'locale' : $stateParams.localeId,
          'docId'  : $stateParams.docId
        }, $scope);
    };

    transUnitCtrl.getLocaleName = function(localeId) {
      return LocaleService.getName(localeId);
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
            'updateURL': true,
            'focus': true}, $scope);
      });
    }

    return transUnitCtrl;
  }

  angular
    .module('app')
    .controller('TransUnitCtrl', TransUnitCtrl);
})();

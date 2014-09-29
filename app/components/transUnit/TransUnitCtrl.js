(function () {
  'use strict';

  /**
   * TransUnitCtrl.js
   * @ngInject
   */
  function TransUnitCtrl($scope, $element, $stateParams, $filter, _,
      TransUnitService, EventService, LocaleService, TransStatusService) {

    var transUnitCtrl = this;

    transUnitCtrl.selected = false;
    transUnitCtrl.saveStatus =
      TransStatusService.getStatusInfo($scope.phrase.status);
    transUnitCtrl.saveOptionsAvailable =
      filterSaveOptions(transUnitCtrl.saveStatus);

    transUnitCtrl.isTranslationModified = function(phrase) {
      return TransUnitService.isTranslationModified(phrase);
    };

    transUnitCtrl.updateSaveState = function() {
      if ($scope.phrase.newTranslation === '') {
        transUnitCtrl.saveStatus =
          TransStatusService.getStatusInfo('untranslated');
      }
      else if ($scope.phrase.translation !== $scope.phrase.newTranslation) {
        transUnitCtrl.saveStatus =
          TransStatusService.getStatusInfo('translated');
      } else {
        transUnitCtrl.saveStatus =
          TransStatusService.getStatusInfo($scope.phrase.status);
      }
      transUnitCtrl.saveOptionsAvailable =
        filterSaveOptions(transUnitCtrl.saveStatus);
      console.log(transUnitCtrl.saveStatus);
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

    transUnitCtrl.copySource = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.COPY_FROM_SOURCE,
        $scope.phrase, $scope);
      transUnitCtrl.updateSaveState($scope.phrase);
    };

    transUnitCtrl.undoEdit = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.UNDO_EDIT,
        $scope.phrase, $scope);
      transUnitCtrl.updateSaveState($scope.phrase);
    };

    transUnitCtrl.cancelEdit = function($event) {
      $event.stopPropagation(); //prevent click event of TU
      EventService.emitEvent(EventService.EVENT.CANCEL_EDIT,
        $scope.phrase, $scope);
    };

    transUnitCtrl.saveAs = function($event, saveId) {
      $event.stopPropagation(); //prevent click event of TU
      console.log(saveId);
      EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
        { 'phrase' : $scope.phrase,
          'state'  : $scope.saveId,
          'locale' : $stateParams.localeId,
          'docId'  : $stateParams.docId
        }, $scope);
    };

    transUnitCtrl.getLocaleDisplayName = function(localeId) {
      return LocaleService.getDisplayName(localeId);
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

    function filterSaveOptions(saveStatus) {
      var filteredOptions = [];
      if (saveStatus.ID === 'untranslated') {
        return '';
      } else {
        filteredOptions = $filter('filter')
          (TransStatusService.getAllAsArray(), {ID: '!untranslated'});
        return $filter('filter')(filteredOptions, {ID: '!'+saveStatus.ID});
      }
    }

    return transUnitCtrl;
  }

  angular
    .module('app')
    .controller('TransUnitCtrl', TransUnitCtrl);
})();

(function () {
  'use strict';

  /**
   * TransUnitCtrl.js
   * @ngInject
   */
  function TransUnitCtrl($scope, $stateParams, $element, $filter, _,
                         TransUnitService, EventService, LocaleService) {
    var transUnitCtrl = this;

    transUnitCtrl.selected = false;
    transUnitCtrl.saveStatus = getSaveDetails($scope.phrase.status);
    transUnitCtrl.saveOptions = createSaveOptions();
    transUnitCtrl.saveOptionsAvailable =
      filterSaveOptions(transUnitCtrl.saveStatus);

    transUnitCtrl.isTranslationModified = function(phrase) {
      return TransUnitService.isTranslationModified(phrase);
    };

    transUnitCtrl.updateSaveState = function() {
      if ($scope.phrase.newTranslation === '') {
        transUnitCtrl.saveStatus = getSaveDetails('untranslated');
      }
      else if ($scope.phrase.translation !== $scope.phrase.newTranslation) {
        transUnitCtrl.saveStatus = getSaveDetails('translated');
      } else {
        transUnitCtrl.saveStatus = getSaveDetails($scope.phrase.status);
      }
      transUnitCtrl.saveOptionsAvailable =
        filterSaveOptions(transUnitCtrl.saveStatus);
    };

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
            'updateURL': true}, $scope);
      });
    }

    function getSaveDetails(saveId) {
      saveId = angular.lowercase(saveId);

      switch (saveId) {
        case 'untranslated':
          return {
            'id': 'untranslated',
            'name': 'Untranslated',
            'class': 'neutral'
          };
        case 'needreview':
          return {
            'id': 'needReview',
            'name': 'Needs Work',
            'class': 'unsure'
          };
        case 'translated':
          return {
            'id': 'translated',
            'name': 'Translated',
            'class': 'success'
          };
        case 'approved':
          return {
            'id': 'approved',
            'name': 'Approved',
            'class': 'highlight'
          };
      }
    }

    function createSaveOptions() {
      var saveOptions = [];

      _.forOwn(TransUnitService.TU_STATE, function(id) {
        saveOptions.push(getSaveDetails(id));
      });

      return saveOptions;
    }

    function filterSaveOptions(saveStatus) {
      var filteredOptions = [];
      if (saveStatus.id === 'untranslated') {
        return '';
      } else {
        filteredOptions =
          $filter('filter')(transUnitCtrl.saveOptions, {id: '!untranslated'});
        return $filter('filter')(filteredOptions, {id: '!'+saveStatus.id});
      }
    }

    return transUnitCtrl;
  }

  angular
    .module('app')
    .controller('TransUnitCtrl', TransUnitCtrl);
})();

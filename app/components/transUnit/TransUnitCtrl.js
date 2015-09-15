(function () {
  'use strict'

  /**
   * TransUnitCtrl.js
   * @ngInject
   */
  function TransUnitCtrl ($rootScope, $scope, $element, $stateParams, _,
                         TransUnitService, EventService, LocaleService, focus,
                         EditorShortcuts, PhraseUtil, SettingsService) {
    var transUnitCtrl = this

    transUnitCtrl.selected = false
    transUnitCtrl.focused = false
    transUnitCtrl.focusedTranslationIndex = 0

    transUnitCtrl.hasTranslationChanged =
      PhraseUtil.hasTranslationChanged

    transUnitCtrl.focusTranslation = function () {
      if (transUnitCtrl.selected) {
        focus('phrase-' + $scope.phrase.id + '-' +
        transUnitCtrl.focusedTranslationIndex)
      }
    }

    // when user clicked on TU or using tab to nav
    transUnitCtrl.onTextAreaFocus = function (phrase, index) {
      transUnitCtrl.focused = true
      if (!_.isUndefined(index)) {
        transUnitCtrl.focusedTranslationIndex = index
      }
      if (!transUnitCtrl.selected) {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
          {'id': phrase.id,
            'updateURL': true,
            'focus': true
          }, $scope)
      }
    }

    transUnitCtrl.translationTextModified = function (phrase) {
      EventService.emitEvent(EventService.EVENT.TRANSLATION_TEXT_MODIFIED,
          phrase)
    }

    transUnitCtrl.getPhrase = function () {
      return $scope.phrase
    }

    transUnitCtrl.init = function () {
      TransUnitService.addController($scope.phrase.id, transUnitCtrl)
      if ($stateParams.id &&
          parseInt($stateParams.id, 10) === $scope.phrase.id) {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
          {'id': $stateParams.id,
            'updateURL': false,
            'focus': $stateParams.selected})
      }
    }

    transUnitCtrl.copySource = function ($event, phrase, sourceIndex) {
      $event.stopPropagation() // prevent click event of TU
      EventService.emitEvent(EventService.EVENT.COPY_FROM_SOURCE,
        {'phrase': phrase, 'sourceIndex': sourceIndex}, $scope)
    }

    transUnitCtrl.undoEdit = function ($event, phrase) {
      $event.stopPropagation() // prevent click event of TU
      EventService.emitEvent(EventService.EVENT.UNDO_EDIT,
        phrase, $scope)
    }

    transUnitCtrl.cancelEdit = function ($event, phrase) {
      $event.stopPropagation() // prevent click event of TU
      EventService.emitEvent(EventService.EVENT.CANCEL_EDIT,
        phrase, $scope)
    }

    transUnitCtrl.saveAs = function ($event, phrase, status) {
      EditorShortcuts.saveTranslationCallBack($event, phrase, status)
    }

    transUnitCtrl.getLocaleName = function (localeId) {
      return LocaleService.getName(localeId)
    }

    transUnitCtrl.toggleSaveAsOptions = function (open) {
      EventService.broadcastEvent(open ? 'openDropdown' : 'closeDropdown',
        {}, $scope)
      if (open) {
        // focus on the first dropdown option
        focus($scope.phrase.id + '-saveAsOption-0')
      }
    }

    var SHOW_SUGGESTIONS = SettingsService.SETTING.SHOW_SUGGESTIONS
    $scope.showSuggestions = SettingsService.subscribe(SHOW_SUGGESTIONS,
      function (show) {
        $scope.showSuggestions = show
      })

    $rootScope.$on(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
      function (event, data) {
        transUnitCtrl.suggestionsSearchIsActive = data
      })

    transUnitCtrl.toggleSuggestionPanel = function () {
      if (transUnitCtrl.suggestionsSearchIsActive) {
        EventService.emitEvent(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
          false)
      } else {
        SettingsService.update(SHOW_SUGGESTIONS, !$scope.showSuggestions)
      }
    }

    $scope.suggestionCount = 0
    $rootScope.$on(EventService.EVENT.PHRASE_SUGGESTION_COUNT,
      function (event, data) {
        if (data.id === $scope.phrase.id) {
          $scope.suggestionCount = data.count
        }
      })

    transUnitCtrl.cancelSaveAsMode = function () {
      EditorShortcuts.cancelSaveAsModeIfOn()
    }

    $scope.$on('$destroy', function () {
      $element.unbind('click', onTransUnitClick)
      $element.unbind('focus', onTransUnitClick)
    })

    transUnitCtrl.updateSaveButton = function (phrase) {
      transUnitCtrl.saveButtonStatus =
        PhraseUtil.getSaveButtonStatus($scope.phrase)
      transUnitCtrl.saveButtonOptions =
        TransUnitService.getSaveButtonOptions(transUnitCtrl.saveButtonStatus,
          $scope.phrase)
      transUnitCtrl.saveButtonText = transUnitCtrl.saveButtonStatus.NAME
      transUnitCtrl.saveButtonDisabled =
        !PhraseUtil.hasTranslationChanged(phrase)
      transUnitCtrl.loadingClass = ''
      transUnitCtrl.savingStatus = ''
    }

    transUnitCtrl.phraseSaving = function (data) {
      transUnitCtrl.loadingClass = 'is-loading'
      transUnitCtrl.saveButtonStatus =
        transUnitCtrl.savingStatus = data.status
      transUnitCtrl.saveButtonOptions =
        TransUnitService.getSaveButtonOptions(transUnitCtrl.saveButtonStatus,
          data.phrase)
      transUnitCtrl.saveButtonText = 'Saving…'
      transUnitCtrl.saveButtonDisabled = true
    }

    transUnitCtrl.saveButtonOptionsAvailable = function () {
      return !_.isEmpty(transUnitCtrl.saveButtonOptions)
    }

    transUnitCtrl.selectTransUnit = function (phrase) {
      if (!transUnitCtrl.selected) {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
                               {'id': phrase.id,
                                 'updateURL': true,
                                 'focus': true
                               }, $scope)
      }
    }

    function onTransUnitClick () {
      if (!transUnitCtrl.selected) {
        $scope.$apply(function () {
          EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
            {'id': $scope.phrase.id,
              'updateURL': true,
              'focus': true}, $scope)
        })
      }
    }

    return transUnitCtrl
  }

  angular
    .module('app')
    .controller('TransUnitCtrl', TransUnitCtrl)
})()

(function () {
  'use strict';

  /**
   * TransUnitService.js
   *
   * @ngInject
   */
  function TransUnitService($rootScope, $state, $stateParams, MessageHandler,
    EventService) {
    var transUnitService = this,
      controllerList = {},
      selectedTUId;

    transUnitService.addController = function(id, controller) {
      controllerList[id] = controller;
    };

    transUnitService.TU_STATE = {
      'TRANSLATED' : 'translated',
      'NEED_REVIEW': 'needReview',
      'APPROVED': 'approved',
      'UNTRANSLATED': 'untranslated'
    };

    /**
     * EventService.EVENT.SELECT_TRANS_UNIT listener
     * - Select and focus a trans-unit.
     * - Perform implicit save on previous selected TU if changed
     * - Update url with TU id without reload state
     */
    $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT,
      function (event, data) {
        var tuController = controllerList[data.id],
          selectedTUController = controllerList[selectedTUId],
          updateURL = data.updateURL;

        if(tuController) {
          if (selectedTUId && selectedTUId !== data.id) {
            //perform implicit save if changed
            if(isTranslationModified(selectedTUController.getPhrase())) {
              EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
                {'phrase' : tuController.getPhrase(),
                  'state': transUnitService.TU_STATE.TRANSLATED},
                $rootScope);
            }
            setFocus(selectedTUController, false);
          }

          selectedTUId = data.id;
          setFocus(tuController, true);

          //Update url without reload state
          if(updateURL) {
            $state.go('editor.selectedTU', {
              'docId': $stateParams.docId,
              'localeId': $stateParams.localeId,
              'tuId' : data.id
            },  {
              notify: false
            });
          }
        } else {
          MessageHandler.displayWarning('Trans-unit not found:' + data.id);
        }
      });

    /**
     * EventService.EVENT.COPY_FROM_SOURCE listener
     * Copy translation from source
     */
    $rootScope.$on(EventService.EVENT.COPY_FROM_SOURCE,
      function (event, phrase) {
        phrase.newTranslation = phrase.source;
      });

    /**
     * EventService.EVENT.CANCEL_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.CANCEL_EDIT,
      function (event, phrase) {
        if (isTranslationModified(phrase)) {
          phrase.newTranslation = phrase.translation;
        }
        setFocus(controllerList[selectedTUId], false);
        selectedTUId = '';
      });

    /**
     * EventService.EVENT.SAVE_TRANSLATION listener
     * Perform save translation with given state
     */
    $rootScope.$on(EventService.EVENT.SAVE_TRANSLATION,
      function (event, data) {
        var phrase = data.phrase,
          state = data.state;

        if(isTranslationModified(phrase)) {
          state = resolveTranslationState(phrase, state);

          //TODO: queue save translation request and perform save,
          //lock TU until success (need version no. of TU)
          console.log('Perform save translation as ' + state);
        }
      });

    function setFocus(controller, isFocus) {
      controller.selected = isFocus || false;
    }

    function resolveTranslationState(phrase, requestState) {
      if(phrase.newTranslation === '') {
        return transUnitService.TU_STATE.UNTRANSLATED;
      }
      return requestState;
    }

    function isTranslationModified(phrase) {
      return phrase.newTranslation !== phrase.translation;
    }

    return transUnitService;
  }

  angular
    .module('app')
    .factory('TransUnitService', TransUnitService);
})();

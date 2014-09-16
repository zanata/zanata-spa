(function () {
  'use strict';

  /**
   * TransUnitService.js
   *
   * @ngInject
   */
  function TransUnitService($rootScope, $state, $stateParams, EventService) {
    var transUnitService = this,
      controllerList = {},
      selectedTUId;

    transUnitService.addController = function(id, controller) {
      controllerList[id] = controller;
    };

    transUnitService.TU_STATUS = {
      'TRANSLATED' : 'translated',
      'FUZZY': 'fuzzy',
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

        if (selectedTUId && selectedTUId !== data.id) {
          //perform implicit save if changed
          if(isTranslationModified(selectedTUController.getPhrase())) {
            EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
              {'phrase' : tuController.getPhrase(),
                'state': transUnitService.TU_STATUS.TRANSLATED},
              $rootScope);
          }
          setFocus(selectedTUController, false);
        }

        selectedTUId = data.id;
        setFocus(tuController, true);

        //Update url without reload state
        if(updateURL && updateURL === true) {
          $state.go('editor.selectedTU', {
            'docId': $stateParams.docId,
            'localeId': $stateParams.localeId,
            'tuId' : data.id
          },  {
            notify: false
          });
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
          status = data.status;

        if(isTranslationModified(phrase)) {
          status = resolveTranslationState(phrase, status);

          //TODO: queue save translation request and perform save,
          //lock TU until success (need version no. of TU)
          console.log('Perform save translation as ' + status);
        }
      });

    function setFocus(controller, isFocus) {
      controller.selected = isFocus || false;
    }

    function resolveTranslationState(phrase, requestStatus) {
      if(phrase.newTranslation === '') {
        return transUnitService.TU_STATUS.UNTRANSLATED;
      }
      return requestStatus;
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

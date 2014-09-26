(function () {
  'use strict';

  /**
   * TransUnitService.js
   *
   * @ngInject
   */
  function TransUnitService($location, $rootScope, $state, $stateParams,
    MessageHandler, EventService) {
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
                {
                  'phrase' : tuController.getPhrase(),
                  'state'  : transUnitService.TU_STATE.TRANSLATED,
                  'locale' : $stateParams.localeId,
                  'docId'  : $stateParams.docId
                }, $rootScope);
            }
            setSelected(selectedTUController, false);
          }

          selectedTUId = data.id;
          setSelected(tuController, true);

          //Update url without reload state
          if(updateURL) {
            $location.search('id', data.id);
            $location.search('selected', data.focus.toString());
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
        setSelected(controllerList[selectedTUId], false);
        selectedTUId = false;

        $location.search('selected', null);
      });

    function setSelected(controller, isSelected) {
      controller.selected = isSelected || false;
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

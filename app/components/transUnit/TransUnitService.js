(function () {
  'use strict';

  /**
   * TransUnitService
   *
   * @ngInject
   */
  function TransUnitService($location, $rootScope, $state, $stateParams,
    $filter, MessageHandler, EventService, TransStatusService) {
    var transUnitService = this,
      controllerList = {},
      selectedTUId;

    transUnitService.addController = function(id, controller) {
      controllerList[id] = controller;
    };

    transUnitService.isTranslationModified = function(phrase) {
      return phrase.newTranslation !== phrase.translation;
    };

    transUnitService.getSaveStatus = function(phrase) {
      if (phrase.newTranslation === '') {
        return TransStatusService.getStatusInfo('untranslated');
      }
      else if (phrase.translation !== phrase.newTranslation) {
        return TransStatusService.getStatusInfo('translated');
      } else {
        return phrase.status;
      }
    };

    transUnitService.getSaveOptions = function(saveStatus) {
      return filterSaveOptions(saveStatus);
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
            if(transUnitService.isTranslationModified(
              selectedTUController.getPhrase())) {
              EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
                {
                  'phrase' : selectedTUController.getPhrase(),
                  'status' : TransStatusService.getStatusInfo('TRANSLATED'),
                  'locale' : $stateParams.localeId,
                  'docId'  : $stateParams.docId
                });
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
     * EventService.EVENT.UNDO_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.UNDO_EDIT,
      function (event, phrase) {
        if (transUnitService.isTranslationModified(phrase)) {
          phrase.newTranslation = phrase.translation;
        }
      });

    /**
     * EventService.EVENT.CANCEL_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.CANCEL_EDIT,
      function (event, phrase) {
        if (transUnitService.isTranslationModified(phrase)) {
          phrase.newTranslation = phrase.translation;
        }
        setSelected(controllerList[selectedTUId], false);
        selectedTUId = false;

        $location.search('selected', null);
      });

    function setSelected(controller, isSelected) {
      controller.selected = isSelected || false;
    }

    /**
     * Filters the dropdown options for saving a translation
     * Unless the translation is empty, remove untranslated as an option
     * Filter the current default save state out of the list and show remaining
     *
     * @param  {Object} saveStatus The current default translation save state
     * @return {Array}             Is used to construct the dropdown list
     */
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

    return transUnitService;
  }

  angular
    .module('app')
    .factory('TransUnitService', TransUnitService);
})();

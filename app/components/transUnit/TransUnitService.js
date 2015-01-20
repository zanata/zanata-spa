(function () {
  'use strict';

  /**
   * TransUnitService
   *
   * See PhraseService.transformToPhrases function for phrase definition.
   *
   * @ngInject
   */
  function TransUnitService(_, $location, $rootScope, $state, $stateParams,
    $filter, MessageHandler, EventService, TransStatusService, PRODUCTION,
    EditorShortcuts, PhraseUtil, $timeout) {
    var transUnitService = this,
        controllerList = {},
        selectedTUId;

    transUnitService.addController = function(id, controller) {
      controllerList[id] = controller;
    };

    transUnitService.getSaveButtonOptions = function(saveButtonStatus) {
      return filterSaveButtonOptions(saveButtonStatus);
    };

    $rootScope.$on(EventService.EVENT.TOGGLE_SAVE_OPTIONS,
      function(event, data) {
        var transUnitCtrl = controllerList[data.id];
        if (transUnitCtrl) {
          transUnitCtrl.toggleSaveAsOptions(data.open);
        }
    });

    /**
     * EventService.EVENT.SELECT_TRANS_UNIT listener
     * - Select and focus a trans-unit.
     * - Perform implicit save on previous selected TU if changed
     * - Update url with TU id without reload state
     */
    $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT,
      function (event, data) {
        var newTuController = controllerList[data.id],
            oldTUController = controllerList[selectedTUId],
            updateURL = data.updateURL;

        if(newTuController) {
          EditorShortcuts.selectedTUCtrl = newTuController;

          if (selectedTUId && selectedTUId !== data.id) {
            //perform implicit save if changed
            if(PhraseUtil.hasTranslationChanged(
              oldTUController.getPhrase())) {
              EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
                {
                  'phrase' : oldTUController.getPhrase(),
                  'status' : TransStatusService.getStatusInfo('TRANSLATED'),
                  'locale' : $stateParams.localeId,
                  'docId'  : $stateParams.docId
                });
            }
            setSelected(oldTUController, false);
          }

          updateSaveButton(event, newTuController.getPhrase());
          selectedTUId = data.id;
          setSelected(newTuController, true);
          if (!newTuController.focused) {
            EventService.emitEvent(EventService.EVENT.FOCUS_TRANSLATION, data);
          }

          //Update url without reload state
          if(updateURL) {
            if($state.current.name !== 'editor.selectedContext.tu') {
              $state.go('editor.selectedContext.tu', {
                'id': data.id,
                'selected': data.focus.toString()
              });
            } else {
              $location.search('id', data.id);
              $location.search('selected', data.focus.toString());
            }
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
      function (event, data) {
        var sourceIndex = 0;
        if(data.phrase.plural) {
          //clicked copy source button
          sourceIndex = data.sourceIndex;
          if(_.isUndefined(sourceIndex)) {
            //copy source key shortcut, copy corresponding source to target
            var transUnitCtrl = controllerList[data.phrase.id];
            sourceIndex = transUnitCtrl.focusedTranslationIndex;
            if(data.phrase.sources.length <
              transUnitCtrl.focusedTranslationIndex + 1) {
              sourceIndex = data.phrase.sources.length - 1;
            }
          }
        }
        setTranslationText(data.phrase, data.phrase.sources[sourceIndex]);
      });

    /**
     * EventService.EVENT.UNDO_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.UNDO_EDIT,
      function (event, phrase) {
        if (PhraseUtil.hasTranslationChanged(phrase)) {
          setAllTranslations(phrase, phrase.translations);
        }
      });

    /**
     * EventService.EVENT.CANCEL_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.CANCEL_EDIT,
      function (event, phrase) {
        if(selectedTUId) {
          setSelected(controllerList[selectedTUId], false);
          selectedTUId = false;
          EditorShortcuts.selectedTUCtrl = null;
        }

        $location.search('selected', null);
        if(!phrase) {
          $location.search('id', null);
        }

        // EditorContentCtrl#changePage doesn't provide a phrase object
        if (phrase) {
          $timeout(function() {
            return $rootScope.$broadcast('blurOn', 'phrase-' + phrase.id);
          });
        }
      });

    /**
     * EventService.EVENT.TRANSLATION_TEXT_MODIFIED listener
     *
     */
    $rootScope.$on(EventService.EVENT.TRANSLATION_TEXT_MODIFIED,
       updateSaveButton);

    /**
     * EventService.EVENT.FOCUS_TRANSLATION listener
     *
     */
    $rootScope.$on(EventService.EVENT.FOCUS_TRANSLATION,
       setFocus);

    /**
      * EventService.EVENT.SAVE_COMPLETED listener
      *
      */
    $rootScope.$on(EventService.EVENT.SAVE_INITIATED,
       phraseSaving);

    /**
      * EventService.EVENT.SAVE_COMPLETED listener
      *
      */
    $rootScope.$on(EventService.EVENT.SAVE_COMPLETED,
       updateSaveButton);

    function setTranslationText(phrase, newText) {
      var index = 0;
      if (phrase.plural) {
        var transUnitCtrl = controllerList[phrase.id];
        index = transUnitCtrl.focusedTranslationIndex;
      }
      phrase.newTranslations[index] = newText;
      EventService.emitEvent(EventService.EVENT.TRANSLATION_TEXT_MODIFIED,
        phrase);
      EventService.emitEvent(EventService.EVENT.FOCUS_TRANSLATION,
        phrase);
    }

    function setAllTranslations(phrase, newTexts) {
      if(!phrase.plural) {
        console.error('This function only process plural');
        return; //only accept plural
      }

      //need slice() for new instance of array
      phrase.newTranslations = newTexts.slice();

      EventService.emitEvent(EventService.EVENT.TRANSLATION_TEXT_MODIFIED,
        phrase);
      EventService.emitEvent(EventService.EVENT.FOCUS_TRANSLATION,
        phrase);
    }

    function updateSaveButton(event, phrase) {
       var transUnitCtrl = controllerList[phrase.id];
       transUnitCtrl.updateSaveButton(phrase);
    }

    function phraseSaving(event, data) {
      var transUnitCtrl = controllerList[data.phrase.id];
      transUnitCtrl.phraseSaving(data);
      EventService.emitEvent(EventService.EVENT.FOCUS_TRANSLATION,
        data.phrase);
    }

    function setSelected(transUnitCtrl, isSelected) {
      //This check is to prevent selected event being triggered repeatedly.
      if(transUnitCtrl.selected !== isSelected) {
        transUnitCtrl.selected = isSelected || false;
      }
    }

    function setFocus(event, phrase) {
      var transUnitCtrl = controllerList[phrase.id];
      transUnitCtrl.focusTranslation();
    }

    /**
     * Filters the dropdown options for saving a translation
     * Unless the translation is empty, remove untranslated as an option
     * Filter the current default save state out of the list and show remaining
     *
     * @param  {Object} saveStatus The current default translation save state
     * @return {Array}             Is used to construct the dropdown list
     */
    function filterSaveButtonOptions(saveStatus) {
      var filteredOptions = [];
      if (saveStatus.ID === 'untranslated' || saveStatus.ID === 'needswork') {
        return [];
      } else {
        filteredOptions = $filter('filter')
          (TransStatusService.getAllAsArray(), {ID: '!untranslated'});
        if (PRODUCTION) {
          filteredOptions = $filter('filter')
            (filteredOptions, {ID: '!approved'});
        }
        return $filter('filter')(filteredOptions, {ID: '!'+saveStatus.ID});
      }
    }

    return transUnitService;
  }

  angular
    .module('app')
    .factory('TransUnitService', TransUnitService);
})();



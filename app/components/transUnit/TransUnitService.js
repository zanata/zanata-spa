(function () {
  'use strict';

  /**
   * TransUnitService
   *
   * @ngInject
   */
  function TransUnitService($location, $rootScope, $state, $stateParams,
    $filter, MessageHandler, EventService, TransStatusService, PRODUCTION,
    PhraseService, EditorShortcuts, $timeout) {
    var transUnitService = this,
        controllerList = {},
        selectedTUId,
        selectedTUCtrl = false
      ;

    transUnitService.addController = function(id, controller) {
      controllerList[id] = controller;
    };

    transUnitService.isTranslationModified = function(phrase) {
      return phrase.newTranslation !== phrase.translation;
    };

    transUnitService.getSaveButtonStatus = function(phrase) {
      if (phrase.newTranslation === '') {
        return TransStatusService.getStatusInfo('untranslated');
      }
      else if (phrase.translation !== phrase.newTranslation) {
        return TransStatusService.getStatusInfo('translated');
      } else {
        return phrase.status;
      }
    };

    transUnitService.getSaveButtonOptions = function(saveButtonStatus) {
      return filterSaveButtonOptions(saveButtonStatus);
    };

    transUnitService.selectedPhrase = function() {
      return selectedTUCtrl ? selectedTUCtrl.getPhrase() : false;
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
          selectedTUCtrl = newTuController;
          EditorShortcuts.currentPhrase = selectedTUCtrl.getPhrase();

          if (selectedTUId && selectedTUId !== data.id) {
            //perform implicit save if changed
            if(transUnitService.isTranslationModified(
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
          EventService.emitEvent(EventService.EVENT.FOCUS_TRANSLATION, data);

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
      function (event, phrase) {
        modifyTranslationText(phrase, phrase.source);
      });

    /**
     * EventService.EVENT.UNDO_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.UNDO_EDIT,
      function (event, phrase) {
        if (transUnitService.isTranslationModified(phrase)) {
          modifyTranslationText(phrase, phrase.translation);
        }
      });

    /**
     * EventService.EVENT.CANCEL_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.CANCEL_EDIT,
      function (event, phrase) {
        if (phrase && transUnitService.isTranslationModified(phrase)) {
          phrase.newTranslation = phrase.translation;
        }
        if(selectedTUId) {
          setSelected(controllerList[selectedTUId], false);
          selectedTUId = false;
          EditorShortcuts.currentPhrase = false;
        }

        $location.search('selected', null);
        if(!phrase) {
          $location.search('id', null);
        }

        $timeout(function() {
          return $rootScope.$broadcast('blurOn', 'phrase-' + phrase.id);
        });
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

    // EventService.EVENT.GOTO_NEXT_ROW listener
    $rootScope.$on(EventService.EVENT.GOTO_NEXT_ROW, goToNextRow);

    // EventService.EVENT.GOTO_PREVIOUS_ROW listener
    $rootScope.$on(EventService.EVENT.GOTO_PREVIOUS_ROW, goToPreviousRow);

    // EventService.EVENT.GOTO_NEXT_UNTRANSLATED listener
    $rootScope.$on(EventService.EVENT.GOTO_NEXT_UNTRANSLATED,
      goToNextUntranslated);

    /**
      * EventService.EVENT.SAVE_COMPLETED listener
      *
      */
    $rootScope.$on(EventService.EVENT.SAVE_COMPLETED,
       updateSaveButton);

    function modifyTranslationText(phrase, newText) {
      phrase.newTranslation = newText;
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
      transUnitCtrl.selected = isSelected || false;
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
      if (saveStatus.ID === 'untranslated') {
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

    function goToNextRow(event, data) {
      PhraseService.findNextId(data.projectSlug, data.versionSlug,
        data.docId, data.localeId, data.currentId).then(function(next) {
          if (next !== data.currentId) {
            EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
              {
                'id': next,
                'updateURL': true,
                'focus' : true
              }, null);
          }
        });

    }

    function goToPreviousRow(event, data) {
      PhraseService.findPreviousId(data.projectSlug, data.versionSlug,
        data.docId, data.localeId, data.currentId).then(function(previous) {
          if (previous !== data.currentId) {
            EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
              {
                'id': previous,
                'updateURL': true,
                'focus' : true
              }, null);
          }
        });
    }

    function goToNextUntranslated(event, data) {
      PhraseService.findNextStatus(data.projectSlug, data.versionSlug,
        data.docId, data.localeId, data.currentId, 'untranslated')
        .then(function(next) {
          if (next !== data.currentId) {
            EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
              {
                'id': next,
                'updateURL': true,
                'focus' : true
              }, null);
          }
        });
    }

    return transUnitService;
  }

  angular
    .module('app')
    .factory('TransUnitService', TransUnitService);
})();

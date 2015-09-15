(function () {
  'use strict'

  /**
   * TransUnitService
   *
   * See PhraseService.transformToPhrases function for phrase definition.
   *
   * @ngInject
   */
  function TransUnitService (_, $location, $rootScope, $state, $stateParams,
    $filter, MessageHandler, EventService, TransStatusService, PRODUCTION,
    EditorShortcuts, PhraseUtil, $timeout) {
    var transUnitService = this
    var controllerList = {}
    var selectedTUId

    transUnitService.addController = function (id, controller) {
      controllerList[id] = controller
    }

    transUnitService.getSaveButtonOptions = function (saveButtonStatus,
        phrase) {
      return filterSaveButtonOptions(saveButtonStatus, phrase)
    }

    $rootScope.$on(EventService.EVENT.TOGGLE_SAVE_OPTIONS,
      function (event, data) {
        var transUnitCtrl = controllerList[data.id]
        if (transUnitCtrl) {
          transUnitCtrl.toggleSaveAsOptions(data.open)
        }
      })

    /**
     * EventService.EVENT.SELECT_TRANS_UNIT listener
     * - Select and focus a trans-unit.
     * - Perform implicit save on previous selected TU if changed
     * - Update url with TU id without reload state
     */
    $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT,
      function (event, data) {
        var newTuController = controllerList[data.id]
        var oldTUController = controllerList[selectedTUId]
        var updateURL = data.updateURL

        EventService.emitEvent(EventService.EVENT.REQUEST_PHRASE_SUGGESTIONS,
          {
            'phrase': newTuController.getPhrase()
          })

        if (newTuController) {
          EditorShortcuts.selectedTUCtrl = newTuController

          if (selectedTUId && selectedTUId !== data.id) {
            setSelected(oldTUController, false)

            // perform implicit save if changed
            if (PhraseUtil.hasTranslationChanged(
              oldTUController.getPhrase())) {
              EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
                {
                  'phrase': oldTUController.getPhrase(),
                  'status': TransStatusService.getStatusInfo('TRANSLATED'),
                  'locale': $stateParams.localeId,
                  'docId': $stateParams.docId
                })
            }
          }

          updateSaveButton(event, newTuController.getPhrase())
          selectedTUId = data.id
          setSelected(newTuController, true)

          EventService.emitEvent(EventService.EVENT.FOCUS_TRANSLATION, data)

          // Update url without reload state
          if (updateURL) {
            if ($state.current.name !== 'editor.selectedContext.tu') {
              $state.go('editor.selectedContext.tu', {
                'id': data.id,
                'selected': data.focus.toString()
              })
            } else {
              $location.search('id', data.id)
              $location.search('selected', data.focus.toString())
            }
          }
        } else {
          MessageHandler.displayWarning('Trans-unit not found:' + data.id)
        }
      })

    /**
     * EventService.EVENT.COPY_FROM_SOURCE listener
     * Copy translation from source
     */
    $rootScope.$on(EventService.EVENT.COPY_FROM_SOURCE,
      function (event, data) {
        var sourceIndex = 0
        if (data.phrase.plural) {
          // clicked copy source button
          sourceIndex = data.sourceIndex
          if (_.isUndefined(sourceIndex)) {
            // copy source key shortcut, copy corresponding source to target
            var transUnitCtrl = controllerList[data.phrase.id]
            sourceIndex = transUnitCtrl.focusedTranslationIndex
            if (data.phrase.sources.length <
              transUnitCtrl.focusedTranslationIndex + 1) {
              sourceIndex = data.phrase.sources.length - 1
            }
          }
        }
        setTranslationText(data.phrase, data.phrase.sources[sourceIndex])
      })

    $rootScope.$on(EventService.EVENT.COPY_FROM_SUGGESTION,
      function (event, data) {
        if (selectedTUId) {
          var transUnitCtrl = controllerList[selectedTUId]
          var phrase = transUnitCtrl.getPhrase()

          var suggestion = data.suggestion
          var targets = suggestion.targetContents

          var copyAsPlurals = phrase.plural && targets.length > 1

          if (copyAsPlurals) {
            var pluralCount = phrase.translations.length

            if (targets.length < pluralCount) {
              var lastSuggestion = _.last(targets)
              // pad suggestions with last suggestion, but only when there are
              // no translations entered for the extra plural forms.
              targets = _.assign(phrase.translations.slice(), targets,
                function (current, suggested) {
                  if (suggested) return suggested
                  if (current) return current
                  return lastSuggestion
                })
            }
            if (targets.length > pluralCount) {
              targets = _.first(targets, pluralCount)
            }

            setAllTranslations(phrase, targets)
          } else {
            setTranslationText(phrase, targets[0])
          }
        }
      })

    /**
     * EventService.EVENT.UNDO_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.UNDO_EDIT,
      function (event, phrase) {
        if (PhraseUtil.hasTranslationChanged(phrase)) {
          setAllTranslations(phrase, phrase.translations)
        }
      })

    /**
     * EventService.EVENT.CANCEL_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.CANCEL_EDIT,
      function (event, phrase) {
        if (selectedTUId) {
          setSelected(controllerList[selectedTUId], false)
          selectedTUId = false
          EditorShortcuts.selectedTUCtrl = null
        }

        $location.search('selected', null)
        if (!phrase) {
          $location.search('id', null)
        }

        // EditorContentCtrl#changePage doesn't provide a phrase object
        if (phrase) {
          $timeout(function () {
            return $rootScope.$broadcast('blurOn', 'phrase-' + phrase.id)
          })
        }
      })

    /**
     * EventService.EVENT.TRANSLATION_TEXT_MODIFIED listener
     *
     */
    $rootScope.$on(EventService.EVENT.TRANSLATION_TEXT_MODIFIED,
       updateSaveButton)

    /**
     * EventService.EVENT.FOCUS_TRANSLATION listener
     *
     */
    $rootScope.$on(EventService.EVENT.FOCUS_TRANSLATION,
       setFocus)

    /**
      * EventService.EVENT.SAVE_COMPLETED listener
      *
      */
    $rootScope.$on(EventService.EVENT.SAVE_INITIATED,
       phraseSaving)

    /**
      * EventService.EVENT.SAVE_COMPLETED listener
      *
      */
    $rootScope.$on(EventService.EVENT.SAVE_COMPLETED,
       updateSaveButton)

    function setTranslationText (phrase, newText) {
      var index = 0
      if (phrase.plural) {
        var transUnitCtrl = controllerList[phrase.id]
        index = transUnitCtrl.focusedTranslationIndex
      }
      phrase.newTranslations[index] = newText
      EventService.emitEvent(EventService.EVENT.TRANSLATION_TEXT_MODIFIED,
        phrase)
      EventService.emitEvent(EventService.EVENT.FOCUS_TRANSLATION,
        phrase)
    }

    function setAllTranslations (phrase, newTexts) {
      // need slice() for new instance of array
      phrase.newTranslations = newTexts.slice()

      EventService.emitEvent(EventService.EVENT.TRANSLATION_TEXT_MODIFIED,
        phrase)
      EventService.emitEvent(EventService.EVENT.FOCUS_TRANSLATION,
        phrase)
    }

    function updateSaveButton (event, phrase) {
      var transUnitCtrl = controllerList[phrase.id]
      transUnitCtrl.updateSaveButton(phrase)
    }

    function phraseSaving (event, data) {
      var transUnitCtrl = controllerList[data.phrase.id]
      transUnitCtrl.phraseSaving(data)
      EventService.emitEvent(EventService.EVENT.FOCUS_TRANSLATION,
        data.phrase)
    }

    function setSelected (transUnitCtrl, isSelected) {
      // This check is to prevent selected event being triggered repeatedly.
      if (transUnitCtrl.selected !== isSelected) {
        transUnitCtrl.selected = isSelected || false
      }
    }

    function setFocus (event, phrase) {
      var transUnitCtrl = controllerList[phrase.id]
      transUnitCtrl.focusTranslation()
    }

    /**
     * Filters the dropdown options for saving a translation
     * Unless the translation is empty, remove untranslated as an option
     * Filter the current default save state out of the list and show remaining
     *
     * @param  {Object} saveStatus The current default translation *save* status
     * @return {Array}             Is used to construct the dropdown list
     */
    function filterSaveButtonOptions (saveStatus, phrase) {
      var filteredOptions = []
      if (saveStatus.ID === 'untranslated') {
        return filteredOptions
      }
      filteredOptions = $filter('filter')(TransStatusService.getAllAsArray(),
                                          {ID: '!untranslated'})

      if (phrase.plural) {
        if (PhraseUtil.hasNoTranslation(phrase)) {
          filteredOptions =
            $filter('filter')(filteredOptions, {ID: '!needswork'})
        } else if (PhraseUtil.hasEmptyTranslation(phrase)) {
          filteredOptions =
            $filter('filter')(filteredOptions, {ID: '!translated'})
        }
      }

      if (PRODUCTION) {
        filteredOptions = $filter('filter')(filteredOptions, {ID: '!approved'})
      }

      return $filter('filter')(filteredOptions, {ID: '!' + saveStatus.ID})
    }

    return transUnitService
  }

  angular
    .module('app')
    .factory('TransUnitService', TransUnitService)
})()

(function() {
  'use strict';



  /**
   * EditorShortcuts.js
   * Manage all editor shortcuts.
   * @ngInject
   */
  function EditorShortcuts(TransUnitService, $stateParams,
                           EventService, EditorService, hotkeys) {
    var editorShortcuts = this;

    editorShortcuts.SHORTCUTS = {
      COPY_SOURCE: 'alt+g',
      CANCEL_EDIT: 'esc',
      SAVE_AS_CURRENT_STATUS: 'ctrl+s',
      GOTO_NEXT_ROW: 'tab',
      GOTO_PREVIOUS_ROW: 'shift+tab',
      GOTO_NEXT_UNTRANSLATED: 'tab+u'
    };

    editorShortcuts.enableCopySource = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.COPY_SOURCE,
        description: 'Copy source as translation',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          var phrase = TransUnitService.selectedPhrase();
          if (phrase) {
            event.preventDefault();
            EventService.emitEvent(
              EventService.EVENT.COPY_FROM_SOURCE, phrase);
          }
        }
      });
    };

    editorShortcuts.enableCancelEdit = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.CANCEL_EDIT,
        description: 'Cancel edit',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          var phrase = TransUnitService.selectedPhrase();
          if (phrase) {
            event.preventDefault();
            EventService.emitEvent(EventService.EVENT.UNDO_EDIT, phrase);
          }
        }
      });
    };

    editorShortcuts.enableSaveAsCurrentStatus = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.SAVE_AS_CURRENT_STATUS,
        description: 'Save as current status',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          var phrase = TransUnitService.selectedPhrase();
          if (phrase) {
            event.preventDefault();
            EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
              {
                'phrase': phrase,
                'status': phrase.status,
                'locale': $stateParams.localeId,
                'docId': $stateParams.docId
              });
          }
        }
      });
    };

    editorShortcuts.enableGoToNext = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.GOTO_NEXT_ROW,
        description: 'Go to next row',
        allowIn: ['INPUT', 'TEXTAREA'],
        /* it has to be on keyup otherwise other keys using tab as combo will
         not work*/
        action: 'keyup',
        callback: function(event) {
          var phrase = TransUnitService.selectedPhrase();
          if (phrase) {
            event.preventDefault();
            event.stopPropagation();
            EventService.emitEvent(EventService.EVENT.GOTO_NEXT_ROW,
              currentContext(phrase));
          }
        }
      });
    };

    editorShortcuts.enableGoToPrevious = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.GOTO_PREVIOUS_ROW,
        description: 'Go to previous row',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function(event) {
          var phrase = TransUnitService.selectedPhrase();
          if (phrase) {
            event.preventDefault();
            EventService.emitEvent(EventService.EVENT.GOTO_PREVIOUS_ROW,
              currentContext(phrase));
          }
        }
      });
    };

    editorShortcuts.enableGoToNextUntranslated = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.GOTO_NEXT_UNTRANSLATED,
        description: 'Go to next untranslated row',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function(event) {
          var phrase = TransUnitService.selectedPhrase();
          if (phrase) {
            event.preventDefault();
            event.stopPropagation();
            EventService.emitEvent(EventService.EVENT.GOTO_NEXT_UNTRANSLATED,
              currentContext(phrase));
          }
        }
      });
    };

    function currentContext(phrase) {
      return {
        'currentId': phrase.id,
        'projectSlug': EditorService.context.projectSlug,
        'versionSlug': EditorService.context.versionSlug,
        'localeId': $stateParams.localeId,
        'docId': $stateParams.docId
      };
    }

    // state comes from $stateChangeSuccess handler in AppCtrl
    editorShortcuts.enableKeysForState = function(state) {
      // only enable shortcuts when it's editing
      if (state.name === 'editor.selectedContext.tu') {
        console.log('enabling shortcuts');
        editorShortcuts.enableCancelEdit();
        editorShortcuts.enableCopySource();
        editorShortcuts.enableSaveAsCurrentStatus();
        editorShortcuts.enableGoToNext();
        editorShortcuts.enableGoToPrevious();
        editorShortcuts.enableGoToNextUntranslated();
      } else {
        hotkeys.del(editorShortcuts.SHORTCUTS.CANCEL_EDIT);
        hotkeys.del(editorShortcuts.SHORTCUTS.SAVE_AS_CURRENT_STATUS);
        hotkeys.del(editorShortcuts.SHORTCUTS.COPY_SOURCE);
        hotkeys.del(editorShortcuts.SHORTCUTS.GOTO_NEXT_ROW);
        hotkeys.del(editorShortcuts.SHORTCUTS.GOTO_PREVIOUS_ROW);
        hotkeys.del(editorShortcuts.SHORTCUTS.GOTO_NEXT_UNTRANSLATED);
      }
    };

    return editorShortcuts;
  }

  angular
    .module('app')
    .factory('EditorShortcuts', EditorShortcuts);
})();




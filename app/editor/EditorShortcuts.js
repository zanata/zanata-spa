(function () {
  'use strict';

  /**
   * @name EditorShortcuts
   * @description controller for editor shortcuts
   * @ngInject
   */
  function EditorShortcuts($rootScope, EventService, $stateParams,
                               _, hotkeys,
                               $timeout, TransStatusService) {
    var editorShortcuts = this;

    // mod will be replaced by ctrl if on windows/linux or cmd if on mac
    editorShortcuts.SHORTCUTS = {
      COPY_SOURCE: 'alt+g',
      CANCEL_EDIT: 'esc',
      SAVE_AS_CURRENT_STATUS: 'mod+s',
      GOTO_NEXT_ROW: 'tab',
      GOTO_PREVIOUS_ROW: 'shift+tab',
      GOTO_NEXT_UNTRANSLATED: 'tab+u',
      SAVE_AS_NEEDS_WORK: 'mod+shift+s n'
    };

    editorShortcuts.currentPhrase = false;

//    $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT, enableEditorKeys);

//    $rootScope.$on(EventService.EVENT.CANCEL_EDIT, disableEditorKey);


    editorShortcuts.enableEditorKeys = function enableEditorKeys() {
      if (!hotkeys.get(editorShortcuts.SHORTCUTS.COPY_SOURCE)) {
        editorShortcuts.enableCancelEditKey();
        editorShortcuts.enableCopySourceKey();
        editorShortcuts.enableGoToNextRowKey();
        editorShortcuts.enableGoToNextUntranslatedKey();
        editorShortcuts.enableGoToPreviousRowKey();
        editorShortcuts.enableSaveAsCurrentKey();
        editorShortcuts.enableSaveAsModeKey();
        editorShortcuts.editorKeysEnabled = true;
      }
    };

    function disableEditorKey() {
      _.forOwn(editorShortcuts.SHORTCUTS, function(value) {
        hotkeys.del(value);
      });
    }

    editorShortcuts.enableCopySourceKey = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.COPY_SOURCE,
        description: 'Copy source as translation',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          if (editorShortcuts.currentPhrase) {
            event.preventDefault();
            EventService.emitEvent(
              EventService.EVENT.COPY_FROM_SOURCE, editorShortcuts.currentPhrase);
          }
        }
      });
    };

    editorShortcuts.enableCancelEditKey = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.CANCEL_EDIT,
        description: 'Cancel edit',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          if (editorShortcuts.currentPhrase) {
            event.preventDefault();
            event.stopPropagation();
            EventService.emitEvent(EventService.EVENT.CANCEL_EDIT, editorShortcuts.currentPhrase);
          }
        }
      });
    };

    editorShortcuts.enableSaveAsCurrentKey = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.SAVE_AS_CURRENT_STATUS,
        description: 'Save as current status',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          if (editorShortcuts.currentPhrase) {
            event.preventDefault();
            EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
              {
                'phrase': editorShortcuts.currentPhrase,
                'status': editorShortcuts.currentPhrase.status,
                'locale': $stateParams.localeId,
                'docId': $stateParams.docId
              });
          }
        }
      });
    };

    editorShortcuts.enableSaveAsModeKey = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.SAVE_AS_NEEDS_WORK,
        description: 'Save as certain state',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          if (editorShortcuts.currentPhrase) {
            event.preventDefault();
            EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
              {
                'phrase': editorShortcuts.currentPhrase,
                'status': TransStatusService.getStatusInfo('needsWork'),
                'locale': $stateParams.localeId,
                'docId': $stateParams.docId
              });
//            addSaveAsModeExtensionKey(phrase, 'n', 'needsWork');
//            addSaveAsModeExtensionKey(phrase, 't', 'translated');
//            addSaveAsModeExtensionKey(phrase, 'a', 'approved');
//            TransUnitService.toggleSaveAsOptions(true);
//            $timeout(cancelSaveAsMode, 1000, true);
          }
        }
      });
    };

    editorShortcuts.enableGoToNextRowKey = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.GOTO_NEXT_ROW,
        description: 'Go to next row',
        allowIn: ['INPUT', 'TEXTAREA'],
        /* it has to be on keyup otherwise other keys using tab as combo will
         not work*/
        action: 'keyup',
        callback: function (event) {
          if (editorShortcuts.currentPhrase) {
            event.preventDefault();
            event.stopPropagation();
            EventService.emitEvent(EventService.EVENT.GOTO_NEXT_ROW,
              currentContext(editorShortcuts.currentPhrase));
          }
        }
      });
    };

    editorShortcuts.enableGoToPreviousRowKey = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.GOTO_PREVIOUS_ROW,
        description: 'Go to previous row',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          if (editorShortcuts.currentPhrase) {
            event.preventDefault();
            EventService.emitEvent(EventService.EVENT.GOTO_PREVIOUS_ROW,
              currentContext());
          }
        }
      });
    };

    editorShortcuts.enableGoToNextUntranslatedKey = function() {
      hotkeys.add({
        combo: editorShortcuts.SHORTCUTS.GOTO_NEXT_UNTRANSLATED,
        description: 'Go to next untranslated row',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          if (editorShortcuts.currentPhrase) {
            event.preventDefault();
            event.stopPropagation();
            EventService.emitEvent(EventService.EVENT.GOTO_NEXT_UNTRANSLATED,
              currentContext());
          }
        }
      });
    };

    function currentContext() {
      return {
        'currentId': editorShortcuts.currentPhrase.id,
        'projectSlug': $stateParams.projectSlug,
        'versionSlug': $stateParams.versionSlug,
        'localeId': $stateParams.localeId,
        'docId': $stateParams.docId
      };
    }

    function addSaveAsModeExtensionKey(phrase, combo, status) {
      var statusInfo = TransStatusService.getStatusInfo(status);

      hotkeys.add({
        combo: combo,
        description: 'Save as ' + statusInfo.NAME,
        allowIn: ['INPUT', 'TEXTAREA'],
        action: 'keydown',
        callback: function (event) {
          event.preventDefault();
          event.stopPropagation();
          EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
            {
              'phrase': phrase,
              'status': statusInfo,
              'locale': $stateParams.localeId,
              'docId': $stateParams.docId
            });
          cancelSaveAsMode(combo);
        }
      });
    }

    function cancelSaveAsMode(combo) {
      if (combo) {
        hotkeys.del(combo);
      } else {
        // cancel by timeout
        hotkeys.del('n');
      }
//      TransUnitService.toggleSaveAsOptions(false);
    }

    return editorShortcuts;
  }

  angular
    .module('app')
    .factory('EditorShortcuts', EditorShortcuts);
})();


(function () {
  'use strict';

  /**
   * @name EditorShortcutsCtrl
   * @description controller for editor shortcuts
   * @ngInject
   */
  function EditorShortcutsCtrl($rootScope, $scope, EventService, $stateParams,
                               EditorService, TransUnitService, _, hotkeys,
                               $timeout, TransStatusService) {
    var editorShortcutsCtrl = this;

    // mod will be replaced by ctrl if on windows/linux or cmd if on mac
    editorShortcutsCtrl.SHORTCUTS = {
      COPY_SOURCE: 'alt+g',
      CANCEL_EDIT: 'esc',
      SAVE_AS_CURRENT_STATUS: 'mod+s',
      GOTO_NEXT_ROW: 'tab',
      GOTO_PREVIOUS_ROW: 'shift+tab',
      GOTO_NEXT_UNTRANSLATED: 'tab+u',
      SAVE_AS: 'mod+shift+s'
    };

    $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT, enableEditorKeys);

    $rootScope.$on(EventService.EVENT.CANCEL_EDIT, disableEditorKey);


    function enableEditorKeys() {
      if (!hotkeys.get(editorShortcutsCtrl.SHORTCUTS.COPY_SOURCE)) {
        editorShortcutsCtrl.enableCancelEditKey();
        editorShortcutsCtrl.enableCopySourceKey();
        editorShortcutsCtrl.enableGoToNextRowKey();
        editorShortcutsCtrl.enableGoToNextUntranslatedKey();
        editorShortcutsCtrl.enableGoToPreviousRowKey();
        editorShortcutsCtrl.enableSaveAsCurrentKey();
        editorShortcutsCtrl.enableSaveAsModeKey();
        editorShortcutsCtrl.editorKeysEnabled = true;
      }
    }

    function disableEditorKey() {
      _.forOwn(editorShortcutsCtrl.SHORTCUTS, function(value) {
        hotkeys.del(value);
      });
    }

    editorShortcutsCtrl.enableCopySourceKey = function() {
      hotkeys.bindTo($scope).add({
        combo: editorShortcutsCtrl.SHORTCUTS.COPY_SOURCE,
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

    editorShortcutsCtrl.enableCancelEditKey = function() {
      hotkeys.add({
        combo: editorShortcutsCtrl.SHORTCUTS.CANCEL_EDIT,
        description: 'Cancel edit',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          var phrase = TransUnitService.selectedPhrase();
          if (phrase) {
            event.preventDefault();
            event.stopPropagation();
            EventService.emitEvent(EventService.EVENT.CANCEL_EDIT, phrase);
          }
        }
      });
    };

    editorShortcutsCtrl.enableSaveAsCurrentKey = function() {
      hotkeys.bindTo($scope).add({
        combo: editorShortcutsCtrl.SHORTCUTS.SAVE_AS_CURRENT_STATUS,
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

    editorShortcutsCtrl.enableSaveAsModeKey = function() {
      hotkeys.bindTo($scope).add({
        combo: editorShortcutsCtrl.SHORTCUTS.SAVE_AS,
        description: 'Save as certain state',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          var phrase = TransUnitService.selectedPhrase();
          if (phrase) {
            event.preventDefault();
            enableSaveAsMode(phrase, 'n', 'needsWork');
            $timeout(cancelSaveAsMode, 1000, true);
          }
        }
      });
    };

    editorShortcutsCtrl.enableGoToNextRowKey = function() {
      hotkeys.bindTo($scope).add({
        combo: editorShortcutsCtrl.SHORTCUTS.GOTO_NEXT_ROW,
        description: 'Go to next row',
        allowIn: ['INPUT', 'TEXTAREA'],
        /* it has to be on keyup otherwise other keys using tab as combo will
         not work*/
        action: 'keyup',
        callback: function (event) {
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

    editorShortcutsCtrl.enableGoToPreviousRowKey = function() {
      hotkeys.bindTo($scope).add({
        combo: editorShortcutsCtrl.SHORTCUTS.GOTO_PREVIOUS_ROW,
        description: 'Go to previous row',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
          var phrase = TransUnitService.selectedPhrase();
          if (phrase) {
            event.preventDefault();
            EventService.emitEvent(EventService.EVENT.GOTO_PREVIOUS_ROW,
              currentContext(phrase));
          }
        }
      });
    };

    editorShortcutsCtrl.enableGoToNextUntranslatedKey = function() {
      hotkeys.bindTo($scope).add({
        combo: editorShortcutsCtrl.SHORTCUTS.GOTO_NEXT_UNTRANSLATED,
        description: 'Go to next untranslated row',
        allowIn: ['INPUT', 'TEXTAREA'],
        callback: function (event) {
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

    function enableSaveAsMode(phrase, combo, status) {
      var statusInfo = TransStatusService.getStatusInfo(status);

      hotkeys.bindTo($scope).add({
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
    }

    return editorShortcutsCtrl;
  }

  angular
    .module('app')
    .controller('EditorShortcutsCtrl', EditorShortcutsCtrl);
})();


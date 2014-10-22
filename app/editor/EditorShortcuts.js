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
    var editorShortcuts = this,
      tabKeyDownPromise = false,
      copySourceCallback,
      gotoNextRowCallback,
      gotoPreviousRowCallback,
      cancelEditCallback,
      saveAsCurrentStatusCallback,
      saveAsModeCallback,
      gotoToNextUntranslatedCallback;

    editorShortcuts.currentPhrase = false;

    copySourceCallback = function(event) {
      if (editorShortcuts.currentPhrase) {
        event.preventDefault();
        EventService.emitEvent(
          EventService.EVENT.COPY_FROM_SOURCE, editorShortcuts.currentPhrase);
      }
    };

    /**
     * due to browser by default intercepts keydown on tab, we can't listen on
     * keyup event. This makes other key shortcut using tab as combination
     * trickier.
     */
    gotoNextRowCallback = function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (editorShortcuts.currentPhrase) {
        // we have to delay the callback because user may be in the middle of
        // pressing key combination like 'tab+n'
        tabKeyDownPromise = $timeout(function() {
          EventService.emitEvent(EventService.EVENT.GOTO_NEXT_ROW,
            currentContext(editorShortcuts.currentPhrase));
        }, 300);
        // we need to blur from textarea otherwise 'tab+n' will insert a 'n'
        $timeout(function() {
          return $rootScope.$broadcast('blurOn', 'phrase-' + editorShortcuts.currentPhrase.id);
        });
      }
    };

    gotoPreviousRowCallback = function (event) {
      if (editorShortcuts.currentPhrase) {
        event.preventDefault();
        EventService.emitEvent(EventService.EVENT.GOTO_PREVIOUS_ROW,
          currentContext());
      }
    };

    cancelEditCallback = function (event) {
      if (editorShortcuts.currentPhrase) {
        event.preventDefault();
        event.stopPropagation();
        EventService.emitEvent(EventService.EVENT.CANCEL_EDIT,
          editorShortcuts.currentPhrase);
      }
    };

    saveAsCurrentStatusCallback = function (event) {
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
    };

    saveAsModeCallback = function (event) {
      var phrase = editorShortcuts.currentPhrase;
      if (phrase) {
        event.preventDefault();
        EventService.emitEvent(EventService.EVENT.TOGGLE_SAVE_OPTIONS,
          {
            'id': phrase.id,
            'open': true
          });
        addSaveAsModeExtensionKey(phrase, 'n', 'needsWork');
        addSaveAsModeExtensionKey(phrase, 't', 'translated');
        addSaveAsModeExtensionKey(phrase, 'a', 'approved');
        $timeout(cancelSaveAsMode, 1000, true);
      }
    };

    gotoToNextUntranslatedCallback = function (event) {
      if (tabKeyDownPromise) {
        $timeout.cancel(tabKeyDownPromise);
        tabKeyDownPromise = false;
      }
      if (editorShortcuts.currentPhrase) {
        event.preventDefault();
        event.stopPropagation();
        EventService.emitEvent(EventService.EVENT.GOTO_NEXT_UNTRANSLATED,
          currentContext());
      }
    };

    /**
     * mod will be replaced by ctrl if on windows/linux or cmd if on mac.
     * By default it listens on keydown event.
     */
    editorShortcuts.SHORTCUTS = {
      COPY_SOURCE: new ShortcutInfo(
        'alt+c', copySourceCallback, 'Copy source as translation', 'alt+g'),

      CANCEL_EDIT: new ShortcutInfo('esc', cancelEditCallback, 'Cancel edit'),

      SAVE_AS_CURRENT_STATUS: new ShortcutInfo(
        'mod+s', saveAsCurrentStatusCallback, 'Save as current status'),

      GOTO_NEXT_ROW: new ShortcutInfo(
        'tab', gotoNextRowCallback, 'Move to next row', ['alt+k', 'alt+down']),

      GOTO_PREVIOUS_ROW: new ShortcutInfo(
        'shift+tab', gotoPreviousRowCallback, 'Move to previous row',
        ['alt+j', 'alt+up']),

      GOTO_NEXT_UNTRANSLATED: new ShortcutInfo(
        'tab+u', gotoToNextUntranslatedCallback),

      SAVE_AS_MODE: new ShortcutInfo(
        'mod+shift+s', saveAsModeCallback, '')
    };

    /**
     *
     * @param defaultKey default key combo for a shortcut
     * @param callback callback to execute
     * @param description
     *  optional. If not empty will apply to default key (shows in cheatsheet)
     * @param otherKeys
     *  optional other keys that will do the same (won't show in cheatsheet)
     * @param action optional event to listen to. i.e. 'keyup' or 'keydown'
     * @returns {EditorShortcuts.ShortcutInfo}
     * @constructor
     */
    function ShortcutInfo(defaultKey, callback, description, otherKeys, action)
    {
      this.defaultKey = defaultKey;
      this.keyCombos = [
        singleKeyConfig(defaultKey, description, action, callback)
      ];
      if (otherKeys) {
        this.otherKeys = otherKeys instanceof Array ? otherKeys : [otherKeys];
        this.keyCombos.push(
          singleKeyConfig(this.otherKeys, '', action, callback));
      }
      return this;
    }

    function singleKeyConfig(combo, description, action, callback) {
      var keyConfig = {
        allowIn: ['TEXTAREA'],
        callback: callback
      };
      keyConfig.combo = combo;
      if (description) {
        keyConfig.description = description;
      }
      if (action) {
        keyConfig.action = action;
      }
      return keyConfig;
    }

    editorShortcuts.enableEditorKeys = function () {
      if (!hotkeys.get(editorShortcuts.SHORTCUTS.COPY_SOURCE.defaultKey)) {
        editorShortcuts.enableCancelEditKey();
        editorShortcuts.enableCopySourceKey();
        editorShortcuts.enableGoToNextRowKey();
        editorShortcuts.enableGoToNextUntranslatedKey();
        editorShortcuts.enableGoToPreviousRowKey();
        editorShortcuts.enableSaveAsCurrentKey();
        editorShortcuts.enableSaveAsModeKey();
      }
    };

    editorShortcuts.disableEditorKey = function () {
      _.forOwn(editorShortcuts.SHORTCUTS, function(value) {
        hotkeys.del(value.keyCombos);
      });
    };

    editorShortcuts.enableCopySourceKey = function() {
      enableShortcut(editorShortcuts.SHORTCUTS.COPY_SOURCE);
    };

    function enableShortcut(shortcutInfo) {
      if (!hotkeys.get(shortcutInfo.defaultKey)) {
        _.forEach(shortcutInfo.keyCombos,
          function(combo) {
            hotkeys.add(combo);
          });
      }
    }

    editorShortcuts.enableCancelEditKey = function() {
      enableShortcut(editorShortcuts.SHORTCUTS.CANCEL_EDIT);
    };

    editorShortcuts.enableSaveAsCurrentKey = function() {
      enableShortcut(editorShortcuts.SHORTCUTS.SAVE_AS_CURRENT_STATUS);
    };

    /**
     * This is to mimic sequence shortcut.
     * i.e. press ctlr-shift-s then within 1 second, press 'n' to save as
     * 'needs work'.
     */
    editorShortcuts.enableSaveAsModeKey = function() {
      enableShortcut(editorShortcuts.SHORTCUTS.SAVE_AS_MODE);
    };

    editorShortcuts.enableGoToNextRowKey = function() {
      enableShortcut(editorShortcuts.SHORTCUTS.GOTO_NEXT_ROW);
    };

    editorShortcuts.enableGoToPreviousRowKey = function() {
      enableShortcut(editorShortcuts.SHORTCUTS.GOTO_PREVIOUS_ROW);
    };

    editorShortcuts.enableGoToNextUntranslatedKey = function() {
      enableShortcut(editorShortcuts.SHORTCUTS.GOTO_NEXT_UNTRANSLATED);
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
          cancelSaveAsMode();
        }
      });
    }

    function cancelSaveAsMode() {
      hotkeys.del('n');
      hotkeys.del('t');
      hotkeys.del('a');
      EventService.emitEvent(EventService.EVENT.TOGGLE_SAVE_OPTIONS,
        {
          'id': editorShortcuts.currentPhrase.id,
          'open': false
        });
    }

    return editorShortcuts;
  }

  angular
    .module('app')
    .factory('EditorShortcuts', EditorShortcuts);
})();





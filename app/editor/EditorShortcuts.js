(function () {
  'use strict';

  /**
   * @name EditorShortcuts
   * @description service for editor shortcuts
   * @ngInject
   */
  function EditorShortcuts(EventService, $stateParams, _, hotkeys,
                           $timeout, TransStatusService, Mousetrap) {
    var editorShortcuts = this,
      tabCombinationPressed = false,
      inSaveAsMode = false;

    // this will be set by TransUnitService
    // on EVENT.SELECT_TRANS_UNIT and unset on EVENT.CANCEL_EDIT
    editorShortcuts.selectedTUCtrl = false;

    function copySourceCallback(event) {
      if (editorShortcuts.selectedTUCtrl) {
        event.preventDefault();
        EventService.emitEvent(EventService.EVENT.COPY_FROM_SOURCE,
          editorShortcuts.selectedTUCtrl.getPhrase());
      }
    }

    /**
     * browser by default intercepts keydown on tab and move focus out of
     * textarea. We can't use hotkeys to do this as it won't allow us register
     * same key twice. Mousetrap is used as it's the underlying library hotkeys
     * uses.
     */
    Mousetrap.bind('tab', function() {
      event.preventDefault();
    }, 'keydown');

    function gotoNextRowCallback(event) {
      if (!tabCombinationPressed && editorShortcuts.selectedTUCtrl) {
        event.preventDefault();
        event.stopPropagation();
        EventService.emitEvent(EventService.EVENT.GOTO_NEXT_ROW,
          currentContext());
      }
    }

    function gotoPreviousRowCallback(event) {
      if (editorShortcuts.selectedTUCtrl) {
        event.preventDefault();
        EventService.emitEvent(EventService.EVENT.GOTO_PREVIOUS_ROW,
          currentContext());
      }
    }

    function cancelEditCallback(event) {
      event.preventDefault();
      event.stopPropagation();
      if (inSaveAsMode) {
        // cancel save as mode
        editorShortcuts.cancelSaveAsModeIfOn();
        if (editorShortcuts.selectedTUCtrl) {
          editorShortcuts.selectedTUCtrl.focusTranslation();
        }
      } else if (editorShortcuts.selectedTUCtrl) {
        var phrase = editorShortcuts.selectedTUCtrl.getPhrase();
        if (phrase.newTranslation !== phrase.translation) {
          // if it has changed translation, undo edit
          EventService.emitEvent(EventService.EVENT.UNDO_EDIT,
            phrase);
        } else {
          // otherwise cancel edit
          EventService.emitEvent(EventService.EVENT.CANCEL_EDIT,
            phrase);
        }
      }
    }

    function saveAsCurrentStatusCallback(event) {
      if (editorShortcuts.selectedTUCtrl) {
        event.preventDefault();
        var phrase = editorShortcuts.selectedTUCtrl.getPhrase();
        EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
          {
            'phrase': phrase,
            'status': phrase.status,
            'locale': $stateParams.localeId,
            'docId': $stateParams.docId
          });
      }
    }

    /**
     * This is to mimic sequence shortcut.
     * i.e. press ctlr-shift-s then within 1 second, press 'n' to save as
     * 'needs work'.
     */
    function saveAsModeCallback(event) {
      var phrase = editorShortcuts.selectedTUCtrl.getPhrase();
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
        inSaveAsMode = true;
      }
    }

    function gotoToNextUntranslatedCallback(event) {
      event.preventDefault();
      event.stopPropagation();
      if (editorShortcuts.selectedTUCtrl) {
        EventService.emitEvent(EventService.EVENT.GOTO_NEXT_UNTRANSLATED,
          currentContext());
        recordTabCombinationPressed();
      }
    }

    /**
     * This is a workaround to avoid an immediate tab keyup event callback.
     */
    function recordTabCombinationPressed() {
      tabCombinationPressed = true;
      $timeout(function () {
        tabCombinationPressed = false;
      }, 500);
    }

    function saveAndGoToNextCallback(event) {
      event.preventDefault();
      if (editorShortcuts.selectedTUCtrl) {
        var statusInfo = TransStatusService.getStatusInfo('translated');
        EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
          {
            'phrase': editorShortcuts.selectedTUCtrl.getPhrase(),
            'status': statusInfo,
            'locale': $stateParams.localeId,
            'docId': $stateParams.docId
          });
        EventService.emitEvent(EventService.EVENT.GOTO_NEXT_ROW,
          currentContext());
      }
    }

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
        'tab', gotoNextRowCallback, 'Move to next row', ['alt+k', 'alt+down'],
        'keyup'),

      GOTO_PREVIOUS_ROW: new ShortcutInfo(
        'shift+tab', gotoPreviousRowCallback, 'Move to previous row',
        ['alt+j', 'alt+up']),

      GOTO_NEXT_UNTRANSLATED: new ShortcutInfo(
        'tab+u', gotoToNextUntranslatedCallback),

      SAVE_AS_MODE: new ShortcutInfo(
        'mod+shift+s', saveAsModeCallback, ''),

      SAVE_AND_GOTO_NEXT: new ShortcutInfo(
        'mod+enter', saveAndGoToNextCallback,
        'Save as translated and move to next'
      )
    };

    /**
     *
     * @param {string} defaultKey default key combo for a shortcut
     * @param {function} callback callback to execute
     * @param {string} [description]
     *  optional. If not empty will apply to default key (shows in cheatsheet)
     * @param {(string|string[])} [otherKeys]
     *  optional other keys that will do the same (won't show in cheatsheet)
     * @param {string} [action] optional event to listen to. i.e. 'keyup'
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
        _.forOwn(editorShortcuts.SHORTCUTS, function(value) {
          enableShortcut(value);
        });
      }
    };

    editorShortcuts.disableEditorKey = function () {
      _.forOwn(editorShortcuts.SHORTCUTS, function(value) {
        _.forEach(value.keyCombos, function(hotkey) {
          editorShortcuts.deleteKeys(hotkey.combo, hotkey.action);
        });
      });
    };

    function enableShortcut(shortcutInfo) {
      if (!hotkeys.get(shortcutInfo.defaultKey)) {
        _.forEach(shortcutInfo.keyCombos,
          function(combo) {
            hotkeys.add(combo);
          });
      }
    }

    function currentContext() {
      return {
        'currentId': editorShortcuts.selectedTUCtrl.getPhrase().id,
        'projectSlug': $stateParams.projectSlug,
        'versionSlug': $stateParams.versionSlug,
        'localeId': $stateParams.localeId,
        'docId': $stateParams.docId
      };
    }

    function addSaveAsModeExtensionKey(phrase, combo, status) {
      var statusInfo = TransStatusService.getStatusInfo(status);
      return hotkeys.add({
        combo: combo,
        description: 'Save as ' + status,
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
          editorShortcuts.cancelSaveAsModeIfOn();
        }
      });
    }

    editorShortcuts.cancelSaveAsModeIfOn = function() {
      if (inSaveAsMode && editorShortcuts.selectedTUCtrl) {
        inSaveAsMode = false;
        editorShortcuts.deleteKeys(['n', 't', 'a']);
        EventService.emitEvent(EventService.EVENT.TOGGLE_SAVE_OPTIONS,
          {
            'id': editorShortcuts.selectedTUCtrl.getPhrase().id,
            'open': false
          });
      }
    };

    /**
     * This is a workaround for augular-hotkeys not being able to delete hotkey.
     * @see https://github.com/chieffancypants/angular-hotkeys/issues/100
     *
     * @param {(string|string[])} keys single key or array of keys to be deleted
     * @param {string} [action='keydown'] 'keyup' or 'keydown' etc.
     */
    editorShortcuts.deleteKeys = function(keys, action) {
      var keysToDelete = keys instanceof Array ? keys : [keys];
      action = action || 'keydown';
      _.forEach(keysToDelete, function(key) {
        hotkeys.del(key);
        Mousetrap.unbind(key, action);
      });
    };

    return editorShortcuts;
  }

  angular
    .module('app')
    .factory('EditorShortcuts', EditorShortcuts);
})();







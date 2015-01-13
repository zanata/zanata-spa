(function () {
  'use strict';

  /**
   * @name EditorShortcuts
   * @description service for editor keyboard shortcuts
   * @ngInject
   */
  function EditorShortcuts(EventService, $stateParams, _, hotkeys, PhraseUtil,
                           TransStatusService, Mousetrap, str, $window) {
    var editorShortcuts = this,
      inSaveAsMode = false;

    // this will be set by TransUnitService
    // on EVENT.SELECT_TRANS_UNIT and unset on EVENT.CANCEL_EDIT
    editorShortcuts.selectedTUCtrl = null;

    function copySourceCallback(event) {
      if (editorShortcuts.selectedTUCtrl) {
        event.preventDefault();
        EventService.emitEvent(EventService.EVENT.COPY_FROM_SOURCE,
          {'phrase': editorShortcuts.selectedTUCtrl.getPhrase()});
      }
    }

    /**
     * browser by default intercepts keydown on tab and move focus out of
     * textarea. We can't use hotkeys to do this as it won't allow us register
     * same key twice. Mousetrap is used as it's the underlying library hotkeys
     * uses.
     */

    // TODO: Unbind tab when transunit is deselected
    //Mousetrap.bind('tab', function(event) {
    //  event.preventDefault();
    //  tabCombinationPressed = false;
    //}, 'keydown');

    function gotoNextRowCallback(event) {
      if (editorShortcuts.selectedTUCtrl) {
        event.preventDefault();
        event.stopPropagation();
        EventService.emitEvent(EventService.EVENT.GOTO_NEXT_ROW,
          currentContext());
      }
    }

    function gotoPreviousRowCallback(event) {
      if (editorShortcuts.selectedTUCtrl) {
        event.preventDefault();
        event.stopPropagation();
        EventService.emitEvent(EventService.EVENT.GOTO_PREVIOUS_ROW,
          currentContext());
      }
    }

    function cancelEditCallback(event) {
      event.preventDefault();
      event.stopPropagation();
      if (inSaveAsMode) {
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

    function saveAsCurrentButtonOptionCallback(event) {
      if (editorShortcuts.selectedTUCtrl) {
        event.preventDefault();
        var phrase = editorShortcuts.selectedTUCtrl.getPhrase();
        EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
          {
            'phrase': phrase,
            'status': PhraseUtil.getSaveButtonStatus(phrase),
            'locale': $stateParams.localeId,
            'docId': $stateParams.docId
          });
      }
    }

    /**
     * This is to mimic sequence shortcut.
     * e.g. press ctlr-shift-s then press 'n' to save as
     * 'needs work'.
     */
    function saveAsModeCallback(event) {
      event.preventDefault();
      editorShortcuts.cancelSaveAsModeIfOn();
      var phrase = editorShortcuts.selectedTUCtrl.getPhrase();
      if (phrase) {
        EventService.emitEvent(EventService.EVENT.TOGGLE_SAVE_OPTIONS,
          {
            'id': phrase.id,
            'open': true
          });

        addSaveAsModeExtensionKey(phrase, 'n', 'needsWork');
        addSaveAsModeExtensionKey(phrase, 't', 'translated');
        addSaveAsModeExtensionKey(phrase, 'a', 'approved');
      }
    }

    // function gotoToNextUntranslatedCallback(event) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   if (editorShortcuts.selectedTUCtrl) {
    //     EventService.emitEvent(EventService.EVENT.GOTO_NEXT_UNTRANSLATED,
    //       currentContext());
    //   }
    //   // the shortcut is a tab + u combination
    //   // we don't want other tab event to trigger
    //   tabCombinationPressed = true;
    // }

    /**
     * mod will be replaced by ctrl if on windows/linux or cmd if on mac.
     * By default it listens on keydown event.
     */
    editorShortcuts.SHORTCUTS = {
      COPY_SOURCE: new ShortcutInfo(
        'alt+c', copySourceCallback, 'Copy source as translation', 'alt+g'),

      CANCEL_EDIT: new ShortcutInfo('esc', cancelEditCallback, 'Cancel edit'),

      SAVE_AS_CURRENT_BUTTON_OPTION: new ShortcutInfo(
        'mod+s', saveAsCurrentButtonOptionCallback, 'Save'),

      SAVE_AS_MODE: new ShortcutInfo(
        'mod+shift+s', saveAsModeCallback, 'Save as…'),

      // this is just so we can show it in cheatsheet.
      // see app/editor/EditorCtrl.shortcuts
      SAVE_AS_NEEDSWORK: {
        keyCombos: [{combo: 'mod+shift+s n', description: 'Save as needs work'}]
      },

      SAVE_AS_TRANSLATED: {
        keyCombos: [{combo: 'mod+shift+s t', description: 'Save as translated'}]
      },

      SAVE_AS_APPROVED: {
        keyCombos: [{combo: 'mod+shift+s a', description: 'Save as approved'}]
      },

      /*GOTO_NEXT_ROW: new ShortcutInfo(
        'tab', gotoNextRowCallback, 'Save and go to next string',
        [], 'keyup'),*/

      // tab as shortcut has to be on keyup
      GOTO_NEXT_ROW_FAST: new ShortcutInfo(
        'mod+enter', gotoNextRowCallback,
        'Save (if changed) and go to next string',
        ['alt+k', 'alt+down'], 'keyup'),

      GOTO_PREVIOUS_ROW: new ShortcutInfo(
        'mod+shift+enter', gotoPreviousRowCallback,
        'Save (if changed) and go to previous string',
        ['alt+j', 'alt+up'])/*,
        disable for now
      GOTO_NEXT_UNTRANSLATED: new ShortcutInfo(
        'tab+u', gotoToNextUntranslatedCallback)*/

    };

    /**
     *
     * @param {string} defaultKey default key combo for a shortcut
     * @param {function} callback callback to execute
     * @param {string} [description]
     *  optional. If not empty will apply to default key (shows in cheatsheet)
     * @param {(string|string[])} [otherKeys]
     *  optional other keys that will do the same (won't show in cheatsheet)
     * @param {string} [action] optional event to listen to. e.g. 'keyup'
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
      // here we only check copy source shortcut since we always enable keys in
      // bundle.
      if (!hotkeys.get(editorShortcuts.SHORTCUTS.COPY_SOURCE.defaultKey)) {
        _.forOwn(editorShortcuts.SHORTCUTS, function(value) {
          if (value instanceof ShortcutInfo) { // a hack to handle sequence keys
            enableShortcut(value);
          }
        });
      }
    };

    editorShortcuts.disableEditorKeys = function () {
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
        'currentId': editorShortcuts.selectedTUCtrl.getPhrase().id
      };
    }

    function addSaveAsModeExtensionKey(phrase, combo, status) {
      var statusInfo = TransStatusService.getStatusInfo(status);
      return hotkeys.add({
        combo: combo,
        description: str.sprintf('Save as %s', status),
        allowIn: ['INPUT', 'TEXTAREA'],
        action: 'keydown',
        callback: function (event) {
          editorShortcuts.saveTranslationCallBack(event, phrase, statusInfo);
        }
      });
    }

    editorShortcuts.saveTranslationCallBack = function(event, phrase,
                                                       statusInfo) {
      inSaveAsMode = true;

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
    };

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

    /**
     * Copied from angular-hotkeys.
     * Convert strings like cmd into symbols like ⌘
     * @param  {String} combo Key combination, e.g. 'mod+f'
     * @return {String} The key combination with symbols
     */
    editorShortcuts.symbolizeKey = function (combo) {
      var map = {
        command: '⌘',
        shift: '⇧',
        left: '←',
        right: '→',
        up: '↑',
        down: '↓',
        'return': '↩',
        backspace: '⌫'
      };
      combo = combo.split('+');

      for (var i = 0; i < combo.length; i++) {
        // try to resolve command / ctrl based on OS:
        if (combo[i] === 'mod') {
          if ($window.navigator &&
            $window.navigator.platform.indexOf('Mac') >= 0) {
            combo[i] = 'command';
          } else {
            combo[i] = 'ctrl';
          }
        }

        combo[i] = map[combo[i]] || combo[i];
      }

      return combo.join(' + ');
    };

    return editorShortcuts;
  }

  angular
    .module('app')
    .factory('EditorShortcuts', EditorShortcuts);
})();


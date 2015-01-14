(function() {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl($scope, UserService, DocumentService, LocaleService,
    ProjectService, EditorService, TransStatusService, StatisticUtil,
    UrlService, $stateParams, $state, MessageHandler, $rootScope,
    EventService, EditorShortcuts, _, Mousetrap) {
    var editorCtrl = this;
    editorCtrl.pageNumber = 1;
    editorCtrl.showCheatsheet = false;
    editorCtrl.shortcuts = _.mapValues(
      _.values(EditorShortcuts.SHORTCUTS), function(shortcutInfo) {
        // second combo (secondary keys) is an array. We have to flatten it
        var keyCombos = _.flatten(shortcutInfo.keyCombos, 'combo');
        return {
        combos: _.map(keyCombos, function(key) {
          return EditorShortcuts.symbolizeKey(key);
        }),
        description: shortcutInfo.keyCombos[0].description
      };
    });

    Mousetrap.bind('?', function(event) {
      var srcElement = event.srcElement;
      if (!editorCtrl.showCheatsheet && !stopCheatsheetCallback(srcElement)) {
        editorCtrl.toggleKeyboardShortcutsModal();
        $scope.$digest();
      }
    }, 'keyup');

    /**
     * Mousetrap by default stops callback on input elements BUT
     * hotkeys monkey patched it!!!
     * TODO change this hack once we remove angular hotkeys
     */
    function stopCheatsheetCallback(element) {
      // if the element has the class "mousetrap" then no need to stop
      if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
        return false;
      }

      // stop for input, select, and textarea
      return element.tagName === 'INPUT' || element.tagName === 'SELECT' ||
        element.tagName === 'TEXTAREA' || element.isContentEditable;
    }

    //TODO: cross domain rest
    //TODO: Unit test

    //Working URL: http://localhost:8000/#/tiny-project/1/translate or
    // http://localhost:8000/#/tiny-project/1/translate/hello.txt/fr
    editorCtrl.context = EditorService.initContext($stateParams.projectSlug,
      $stateParams.versionSlug, DocumentService.decodeDocId($stateParams.docId),
      LocaleService.DEFAULT_LOCALE, LocaleService.DEFAULT_LOCALE.localeId,
      'READ_WRITE');

    editorCtrl.toggleKeyboardShortcutsModal = function() {
      editorCtrl.showCheatsheet = !editorCtrl.showCheatsheet;
    };

    editorCtrl.versionPage = function() {
      return UrlService.PROJECT_PAGE(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug);
    };

    editorCtrl.encodeDocId = function(docId) {
      return DocumentService.encodeDocId(docId);
    };

    ProjectService.getProjectInfo($stateParams.projectSlug).then(
      function(projectInfo) {
        editorCtrl.projectInfo = projectInfo;
      },
      function(error) {
        MessageHandler.displayError('Error getting project ' +
          'information:' + error);
      });

    LocaleService.getSupportedLocales(editorCtrl.context.projectSlug,
      editorCtrl.context.versionSlug).then(
      function(locales) {
        editorCtrl.locales = locales;
        if (!editorCtrl.locales || editorCtrl.locales.length <= 0) {
          //redirect if no supported locale in version
          MessageHandler.displayError('No supported locales in ' +
            editorCtrl.context.projectSlug + ' : ' +
            editorCtrl.context.versionSlug);
        } else {
          //if localeId is not defined in url, set to first from list
          var selectedLocaleId = $state.params.localeId;
          var context = editorCtrl.context;

          if (!selectedLocaleId) {
            context.localeId = editorCtrl.locales[0].localeId;
            transitionToEditorSelectedView();
          } else {
            context.localeId = selectedLocaleId;
            if (!LocaleService.containsLocale(editorCtrl.locales,
              selectedLocaleId)) {
              context.localeId = editorCtrl.locales[0].localeId;
            }
          }
        }
      }, function(error) {
        MessageHandler.displayError('Error getting locale list: ' + error);
      });

    DocumentService.findAll(editorCtrl.context.projectSlug,
      editorCtrl.context.versionSlug).then(
      function(documents) {
        editorCtrl.documents = documents;

        if (!editorCtrl.documents || editorCtrl.documents.length <= 0) {
          //redirect if no documents in version
          MessageHandler.displayError('No documents in ' +
            editorCtrl.context.projectSlug + ' : ' +
            editorCtrl.context.versionSlug);
        } else {
          //if docId is not defined in url, set to first from list
          var selectedDocId = $state.params.docId,
              context = editorCtrl.context;
          if (!selectedDocId) {
            context.docId = editorCtrl.documents[0].name;
            transitionToEditorSelectedView();
          } else {
            context.docId = DocumentService.decodeDocId(selectedDocId);
            if (!DocumentService.containsDoc(editorCtrl.documents,
              context.docId)) {
              context.docId = editorCtrl.documents[0].name;
            }
          }
        }
      }, function(error) {
        MessageHandler.displayError('Error getting document list: ' + error);
      });

    $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT,
      function (event, data) {
        editorCtrl.unitSelected = data.id;
        editorCtrl.focused = data.focus;
      });

    $rootScope.$on(EventService.EVENT.CANCEL_EDIT,
      function () {
        editorCtrl.unitSelected = false;
        editorCtrl.focused = false;
      });

    $rootScope.$on(EventService.EVENT.REFRESH_STATISTIC,
      function (event, data) {

        loadStatistic(data.projectSlug, data.versionSlug, data.docId,
          data.localeId);

        editorCtrl.context.docId = data.docId;
        editorCtrl.context.localeId = data.localeId;
      });

    editorCtrl.pageNumber = function() {
      if(EditorService.maxPageIndex === 0) {
        return EditorService.currentPageIndex + 1;
      } else {
        return (EditorService.currentPageIndex + 1) + ' of ' +
          (EditorService.maxPageIndex + 1);
      }
    };

    editorCtrl.getLocaleName = function(localeId) {
      return LocaleService.getName(localeId);
    };

    editorCtrl.firstPage = function() {
      EventService.emitEvent(EventService.EVENT.GOTO_FIRST_PAGE);
    };

    editorCtrl.lastPage = function() {
      EventService.emitEvent(EventService.EVENT.GOTO_LAST_PAGE);
    };


    editorCtrl.nextPage = function() {
      EventService.emitEvent(EventService.EVENT.GOTO_NEXT_PAGE);
    };

    editorCtrl.previousPage = function() {
      EventService.emitEvent(EventService.EVENT.GOTO_PREV_PAGE);
    };

    //tu states to include for display
    editorCtrl.filter = {
      'all': true,
      'approved' : false,
      'translated' : false,
      'needsWork': false,
      'untranslated': false
    };

    editorCtrl.resetFilter = function() {
      editorCtrl.filter.all = true;
      editorCtrl.filter.approved = false;
      editorCtrl.filter.translated = false;
      editorCtrl.filter.needsWork = false;
      editorCtrl.filter.untranslated = false;

      EventService.emitEvent(EventService.EVENT.FILTER_TRANS_UNIT,
        editorCtrl.filter);
    };

    editorCtrl.updateFilter = function() {
      if(editorCtrl.filter.approved === editorCtrl.filter.translated &&
        editorCtrl.filter.translated === editorCtrl.filter.needsWork &&
        editorCtrl.filter.needsWork === editorCtrl.filter.untranslated) {
        editorCtrl.resetFilter();
      } else {
        editorCtrl.filter.all = false;
        EventService.emitEvent(EventService.EVENT.FILTER_TRANS_UNIT,
          editorCtrl.filter);
      }
    };

    function transitionToEditorSelectedView() {
      if (isDocumentAndLocaleSelected()) {
        $state.go('editor.selectedContext', {
          'docId': editorCtrl.context.docId,
          'localeId': editorCtrl.context.localeId
        });
      }
    }

    function isDocumentAndLocaleSelected() {
      return editorCtrl.context.docId && editorCtrl.context.localeId;
    }

    /**
     * Load document statistics (word and message)
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    function loadStatistic(projectSlug, versionSlug, docId, localeId) {
      DocumentService.getStatistics(projectSlug, versionSlug, docId, localeId)
        .then(function(statistics) {
            editorCtrl.wordStatistic = StatisticUtil
              .getWordStatistic(statistics);
            editorCtrl.messageStatistic = StatisticUtil
              .getMsgStatistic(statistics);
          },
          function(error) {
            MessageHandler.displayError('Error loading statistic: ' + error);
          });
    }

    this.settings = UserService.settings.editor;

    EditorShortcuts.enableEditorKeys();
  }

  angular
    .module('app')
    .controller('EditorCtrl', EditorCtrl);
})();

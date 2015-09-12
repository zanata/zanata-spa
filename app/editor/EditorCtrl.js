(function() {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl($scope, UserService, DocumentService, LocaleService,
    ProjectService, EditorService, SettingsService, StatisticUtil,
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

    //tu status to include for display
    editorCtrl.filter = {
      'status': {
        'all': true,
        'approved': false,
        'translated': false,
        'needsWork': false,
        'untranslated': false
      }
    };

    processFilterQuery();

    //This is just processing UI during startup,
    //phrase filtering are done in EditorContentCtrl during init
    function processFilterQuery() {
      //process filter query
      var status = UrlService.readValue('status');

      if(!_.isUndefined(status)) {
        status = status.split(',');
        _.forEach(status, function(val) {
          if(!_.isUndefined(editorCtrl.filter.status[val])) {
            editorCtrl.filter.status[val] = true;
          }
        });
        updateFilter();
      }
    }

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
      $scope.$apply(function () {
        editorCtrl.showCheatsheet = !editorCtrl.showCheatsheet;
      });
    };

    var SHOW_SUGGESTIONS = SettingsService.SETTING.SHOW_SUGGESTIONS;
    $scope.showSuggestions = SettingsService.subscribe(SHOW_SUGGESTIONS,
      function (show) {
        $scope.showSuggestions = show;
      });
    editorCtrl.toggleSuggestionPanel = function () {
      SettingsService.update(SHOW_SUGGESTIONS, !$scope.showSuggestions);
    };


    editorCtrl.versionPage = function() {
      return UrlService.projectPage(editorCtrl.context.projectSlug,
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
      return EditorService.currentPageIndex + 1;
    };

    /**
     * Page count, or undefined if count is not known
     */
    editorCtrl.pageCount = function () {
      var maxIndex = EditorService.maxPageIndex;
      return _.isNull(maxIndex) ? undefined : maxIndex + 1;
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

    editorCtrl.resetFilter = function() {
      resetFilter(true);
    };

    editorCtrl.updateFilter = function() {
      updateFilter(true);
    };

    editorCtrl.toggleMainNav = function() {
      $scope.$apply(function () {
        editorCtrl.settings.hideMainNav = !editorCtrl.settings.hideMainNav;
      });
    };

    function updateFilter(fireEvent) {
      if(isStatusSame(editorCtrl.filter.status)) {
        resetFilter(fireEvent);
      } else {
        editorCtrl.filter.status.all = false;
        if(fireEvent) {
          EventService.emitEvent(EventService.EVENT.FILTER_TRANS_UNIT,
            editorCtrl.filter);
        }
      }
    }

    function resetFilter(fireEvent) {
      editorCtrl.filter.status.all = true;
      editorCtrl.filter.status.approved = false;
      editorCtrl.filter.status.translated = false;
      editorCtrl.filter.status.needsWork = false;
      editorCtrl.filter.status.untranslated = false;

      if(fireEvent) {
        EventService.emitEvent(EventService.EVENT.FILTER_TRANS_UNIT,
          editorCtrl.filter);
      }
    }

    function isStatusSame(statuses) {
      return statuses.approved === statuses.translated &&
        statuses.translated === statuses.needsWork &&
        statuses.needsWork === statuses.untranslated;
    }

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

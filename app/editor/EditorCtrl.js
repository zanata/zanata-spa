(function() {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl(UserService, DocumentService, LocaleService,
    ProjectService, TransUnitService, EditorService, TransStatusService,
    StatisticUtil, $stateParams, $state, MessageHandler, $rootScope,
    EventService) {
    var editorCtrl = this;
    editorCtrl.pageNumber = 1;

    //TODO: cross domain rest
    //TODO: Unit test

    //Working URL: http://localhost:8000/#/tiny-project/1/translate or
    // http://localhost:8000/#/tiny-project/1/translate/hello.txt/fr
    editorCtrl.context = EditorService.initContext($stateParams.projectSlug,
      $stateParams.versionSlug, $stateParams.docId,
      LocaleService.DEFAULT_LOCALE, LocaleService.DEFAULT_LOCALE.localeId,
      'READ_WRITE');

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
            context.docId = selectedDocId;
            if (!DocumentService.containsDoc(editorCtrl.documents,
              selectedDocId)) {
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
            // Make needReview(server) available to needswork
            editorCtrl.messageStatistic[TransStatusService.getId('needswork')] =
              editorCtrl.messageStatistic.needReview || 0;
          },
          function(error) {
            MessageHandler.displayError('Error loading statistic: ' + error);
          });
    }

    this.settings = UserService.settings.editor;
  }

  angular
    .module('app')
    .controller('EditorCtrl', EditorCtrl);
})();

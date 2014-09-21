(function() {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl(UserService, DocumentService, LocaleService,
    ProjectService, TransUnitService, SaveTranslationService, EditorService,
    StatisticUtil, $stateParams, $state, MessageHandler) {
    var editorCtrl = this;

    //TODO: cross domain rest
    //TODO: Unit test

    //Working URL: http://localhost:8000/#/tiny-project/1/translate or
    // http://localhost:8000/#/tiny-project/1/translate/hello.txt/fr
    editorCtrl.context = EditorService.initContext($stateParams.projectSlug,
      $stateParams.versionSlug, $stateParams.docId,
      LocaleService.DEFAULT_LOCALE, LocaleService.DEFAULT_LOCALE, 'READ_WRITE');

    ProjectService.getProjectInfo($stateParams.projectSlug).then(
      function(projectInfo) {
        editorCtrl.projectInfo = projectInfo;
      },
      function(error) {
        MessageHandler.displayError('Error getting project ' +
          'information:' + error);
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
          if (isDocumentAndLocaleSelected()) {
            loadStatistic(context.projectSlug, context.versionSlug,
              context.docId, context.locale.localeId);
          }
        }
      }, function(error) {
        MessageHandler.displayError('Error getting document list: ' + error);
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
            context.locale = editorCtrl.locales[0];
            transitionToEditorSelectedView();
          } else {
            context.locale = LocaleService.getLocaleByLocaleId(
              editorCtrl.locales, selectedLocaleId);
            if (!context.locale) {
              context.locale = editorCtrl.locales[0];
            }
          }
          if (isDocumentAndLocaleSelected()) {
            loadStatistic(context.projectSlug, context.versionSlug,
              context.docId, context.locale.localeId);
          }
        }
      }, function(error) {
        MessageHandler.displayError('Error getting locale list: ' + error);
      });

    editorCtrl.updateSelectedDoc = function(docId) {
      editorCtrl.context.docId = docId;

      loadStatistic(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug, editorCtrl.context.docId,
        editorCtrl.context.locale.localeId);
    };

    editorCtrl.updateSelectedLocale = function(locale) {
      editorCtrl.context.locale = locale;
      loadStatistic(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug, editorCtrl.context.docId,
        editorCtrl.context.locale.localeId);
    };

    function transitionToEditorSelectedView() {
      if (isDocumentAndLocaleSelected()) {
        $state.go('editor.selectedContext', {
          'docId': editorCtrl.context.docId,
          'localeId': editorCtrl.context.locale.localeId
        });
      }
    }

    function isDocumentAndLocaleSelected() {
      return editorCtrl.context.docId && editorCtrl.context.locale;
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
        .then(
          function(statistics) {
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
  }

  angular
    .module('app')
    .controller('EditorCtrl', EditorCtrl);
})();

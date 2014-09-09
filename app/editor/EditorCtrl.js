(function() {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl(UserService, PhraseService, DocumentService,
      LocaleService, UrlService, StatisticUtil, ProjectService, $stateParams,
      $location, MessageHandler) {
    var limit = 50,
      editorCtrl = this;

    //TODO: cross domain rest
    //TODO: Unit test

    //Working URL: http://localhost:8000/#/tiny-project/1 or
    // http://localhost:8000/#/tiny-project/1?docId=hello.txt&localeId=fr

    editorCtrl.context = UserService.editorContext($stateParams.projectSlug,
        $stateParams.versionSlug, '', '', 'READ_WRITE');

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
            var selectedDocId = UrlService.readValue('docId');
            //            var selectedDocId = $stateParams.docId;
            if (!selectedDocId) {
              editorCtrl.context.document = editorCtrl.documents[0];
            } else {
              editorCtrl.context.document = DocumentService.getDocById(
                editorCtrl.documents, selectedDocId);
              if (!editorCtrl.context.document) {
                editorCtrl.context.document = editorCtrl.documents[0];
              }
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
            var selectedLocaleId = UrlService.readValue('localeId');
            //var selectedDocId = $stateParams.localeId;
            if (!selectedLocaleId) {
              editorCtrl.context.locale = editorCtrl.locales[0];
            } else {
              editorCtrl.context.locale = LocaleService.getLocaleByLocaleId(
                  editorCtrl.locales, selectedLocaleId);
              if (!editorCtrl.context.locale) {
                editorCtrl.context.locale = editorCtrl.locales[0];
              }
            }
          }
        }, function(error) {
          MessageHandler.displayError('Error getting locale list: ' + error);
        });

    // On selected document or locale changed
    editorCtrl.onLocaleOrDocumentChanged = function() {
      if (editorCtrl.context.document && editorCtrl.context.locale) {
        var context = editorCtrl.context;

        //update url
        $location.search('docId', context.document.name);
        $location.search('localeId', context.locale.localeId);

        editorCtrl.loadStatistic(context.projectSlug, context.versionSlug,
            context.document.name, context.locale.localeId);

        editorCtrl.loadPhrases(context.projectSlug, context.versionSlug,
            context.document.name, context.locale.localeId);
      }
    };

    /**
     * Load document statistics (word and message)
     * see EditorCtrl.onLocaleOrDocumentChanged
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    editorCtrl.loadStatistic = function(projectSlug, versionSlug, docId,
        localeId) {
      DocumentService.getStatistics(projectSlug, versionSlug, docId, localeId)
          .then(
              function(statistics) {
                editorCtrl.wordStatistic = StatisticUtil
                    .getWordStatistic(statistics);
                editorCtrl.messageStatistic = StatisticUtil
                    .getMsgStatistic(statistics);
              },
              function(error) {
                MessageHandler
                    .displayError('Error loading statistic: ' + error);
              });
    };

    /**
     * Load transUnit
     * see EditorCtrl.onLocaleOrDocumentChanged
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    editorCtrl.loadPhrases = function(projectSlug, versionSlug,
                                     docId, localeId) {
      PhraseService.findAll(limit, projectSlug, versionSlug, docId, localeId)
          .then(function(phrases) {
            editorCtrl.phrases = phrases;
          });
    };

    this.settings = UserService.settings.editor;
  }

  angular.module('app').controller('EditorCtrl', EditorCtrl);
})();

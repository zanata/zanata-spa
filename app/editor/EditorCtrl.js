(function() {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl(UserService, PhraseService, DocumentService,
      ContextService, LocaleService, StatisticUtil, ProjectService,
      $stateParams) {
    var limit = 50, editorCtrl = this;

    //TODO: perform login (cross domain)
    //TODO: Load statistic and transUnit after doc and locale selected
    //TODO: Localized string

    //Working URL: http://localhost:8000/#/tiny-project/1 or
    // http://localhost:8000/#/tiny-project/1/hello/fr

    //perform login
    //UserService.login('aeng', '79834005e9a0206453cdc9f0a33aef66');

    ProjectService.getProjectInfo($stateParams.projectSlug).then(
        function(projectInfo) {
          editorCtrl.projectInfo = projectInfo;
        }, function(error) {
          console.error('Error getting project information:' + error);
        });

    editorCtrl.context = ContextService.loadEditorContext(
        $stateParams.projectSlug, $stateParams.versionSlug);

    DocumentService.findAll(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug).then(
        function(documents) {
          editorCtrl.documents = documents;

          //if docId is not defined in url, set to first from list
          if (!$stateParams.docId && editorCtrl.documents.length > 0) {
            editorCtrl.selectedDocument = editorCtrl.documents[0];
          } else {
            editorCtrl.selectedDocument = editorCtrl.getDocById(documents,
                $stateParams.docId);
          }
        }, function(error) {
          console.error('Error getting document list:' + error);
        });

    LocaleService.getSupportedLocales(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug).then(
        function(locales) {
          editorCtrl.locales = locales;

          //if localeId is not defined in url, set to first from list
          if (!$stateParams.localeId && editorCtrl.locales.length > 0) {
            editorCtrl.selectedLocale = editorCtrl.locales[0];
          } else {
            editorCtrl.selectedLocale = editorCtrl.getLocaleByLocaleId(locales,
                $stateParams.localeId);
          }
        }, function(error) {
          console.error('Error getting locale list:' + error);
        });

    editorCtrl.getDocById = function(documents, docId) {
      for ( var i in documents) {
        if (documents[i].name === docId) {
          return documents[i];
        }
      }
    };

    editorCtrl.getLocaleByLocaleId = function(locales, localeId) {
      for ( var i in locales) {
        if (locales[i].localeId === localeId) {
          return locales[i];
        }
      }
    };

    editorCtrl.loadStatistic = function() {
      if (editorCtrl.selectedDocument && editorCtrl.selectedLocale) {
        DocumentService.getStatistics(editorCtrl.context.projectSlug,
            editorCtrl.context.versionSlug, editorCtrl.selectedDocument.name,
            editorCtrl.selectedLocale.localeId).then(
            function(statistics) {
              editorCtrl.wordStatistic = StatisticUtil
                  .getWordStatistic(statistics);
              editorCtrl.msgStatistic = StatisticUtil
                  .getMsgStatistic(statistics);
              editorCtrl.statisticStyles = StatisticUtil
                  .getStyles(editorCtrl.wordStatistic);
            }, function(error) {
              console.error('Error getting statistic:' + error);
            });
      }
    };

    /**
     * should listen to onChange event in selectedDoc
     * and selectedLocale dropdown
     */
    PhraseService.findAll(limit).then(function(phrases) {
      editorCtrl.phrases = phrases;
    });

    this.settings = UserService.settings.editor;
  }

  angular.module('app').controller('EditorCtrl', EditorCtrl);
})();

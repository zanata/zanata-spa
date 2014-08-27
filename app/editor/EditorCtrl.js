(function () {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl (UserService, PhraseService, DocumentService,
    ContextService, LocaleService, StatisticUtil,
    ProjectService, $stateParams) {
    var limit = 50, editorCtrl = this;

    //TODO: perform login (cross domain)
    //TODO: Bind doc and locale dropdown to selectedDocID, selectedLocaleId
    //TODO: Load statistic and transUnit after doc and locale selected
    //TODO: Localized string

    //Working URL: http://localhost:8000/#/tiny-project/1 or
    // http://localhost:8000/#/tiny-project/1/hello/fr

    //perform login
    //UserService.login('aeng', '79834005e9a0206453cdc9f0a33aef66');

    ProjectService.getProjectInfo($stateParams.projectSlug).
      then(function(projectInfo) {
        editorCtrl.projectInfo = projectInfo;
      },
      function (error) {
        console.error('Error getting project information:' + error);
      });

    editorCtrl.context = ContextService.loadEditorContext
    ($stateParams.projectSlug, $stateParams.versionSlug,
      $stateParams.docId, $stateParams.localeId);

    DocumentService.findAll(editorCtrl.context.projectSlug,
      editorCtrl.context.versionSlug)
      .then(function (documents) {
        editorCtrl.documents = documents;

        //if docId is not defined in url, set to first from list
        if(!editorCtrl.context.docId && editorCtrl.documents.length > 0) {
          editorCtrl.context.docId = editorCtrl.documents[0].docId;
        }
      },
      function (error) {
        console.error('Error getting document list:' + error);
      });

    LocaleService.getSupportedLocales(editorCtrl.context.projectSlug,
      editorCtrl.context.versionSlug).then(function(locales) {
        editorCtrl.locales = locales;

        //if localeId is not defined in url, set to first from list
        if(!editorCtrl.context.localeId && editorCtrl.locales.length > 0) {
          editorCtrl.context.localeId = editorCtrl.locales[0].localeId;
        }
      },
      function(error) {
        console.error('Error getting locale list:' + error);
      });

    /**
     * should listen to onChange event in selectedDoc
     * and selectedLocale dropdown
     */
    DocumentService.getStatistics(editorCtrl.context.projectSlug,
      editorCtrl.context.versionSlug, editorCtrl.context.docId,
      editorCtrl.context.localeId).
      then(function(statistics) {

        editorCtrl.wordStatistic = StatisticUtil.getWordStatistic(statistics);
        editorCtrl.msgStatistic = StatisticUtil.getMsgStatistic(statistics);

        editorCtrl.statisticStyles =
          StatisticUtil.getStyles(editorCtrl.wordStatistic);
      },
      function(error) {
        console.error('Error getting statistic:' + error);
      });

    /**
     * should listen to onChange event in selectedDoc
     * and selectedLocale dropdown
     */
    PhraseService.findAll(limit).then(function(phrases){
      editorCtrl.phrases = phrases;
    });

    this.settings = UserService.settings.editor;
  }

  angular
    .module('app')
    .controller('EditorCtrl', EditorCtrl);
})();

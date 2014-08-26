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
      },
      function (error) {
        console.error('Error getting document list:' + error);
      });

    LocaleService.getSupportedLocales(editorCtrl.context.projectSlug,
      editorCtrl.context.versionSlug).then(function(locales) {
        editorCtrl.locales = locales;
      },
      function(error) {
        console.error('Error getting locale list:' + error);
      });

    //if(editorCtrl.context.docId) {
    // bind to selectedDocId = $stateParams.docId
    //}

    //if(editorCtrl.context.localeId) {
    // bind to selectedLocaleId = $stateParams.localeId
    //}

    /**
     * should listen to onChange event in selectedDoc
     * and selectedLocale dropdown
     */
    DocumentService.getStatistic(editorCtrl.context.projectSlug,
      editorCtrl.context.versionSlug, editorCtrl.context.docId,
      editorCtrl.context.localeId).
      then(function(statistic) {
        editorCtrl.statistic = statistic;
        editorCtrl.statisticStyles = StatisticUtil.getStyles(statistic);
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

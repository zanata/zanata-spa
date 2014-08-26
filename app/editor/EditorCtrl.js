(function () {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl (UserService, PhraseService, DocumentService,
    ContextService, LocaleService, StatisticUtil) {
    var limit = 50, selectedDocId = 'hello', selectedLocaleId = 'fr',
      editorCtrl = this;

    //TODO: perform login (cross domain)
    //TODO: URL structure for projectSlug, versionSlug, selectedDocID, selectedLocaleId
    //TODO: Load statistic and transUnit after doc and locale selected


    //perform login
    //UserService.login('aeng', '79834005e9a0206453cdc9f0a33aef66');

    editorCtrl.context = ContextService.loadEditorContext();

    DocumentService.findAll(editorCtrl.context.projectSlug,
                            editorCtrl.context.versionSlug)
      .then(function(documents){
            editorCtrl.documents = documents;
      },
      function(error) {
            console.error('Error getting document list:' + error);
      });

    LocaleService.getSupportedLocales(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug).then(function(locales) {
        editorCtrl.locales = locales;
    },
    function(error) {
        console.error('Error getting locale list:' + error);
    });

    //should trigger these after selectedDoc and selectedLocale is set
    DocumentService.getStatistic(editorCtrl.context.projectSlug,
      editorCtrl.context.versionSlug, selectedDocId, selectedLocaleId).
      then(function(statistic) {
        editorCtrl.statistic = statistic;
        editorCtrl.statisticStyles = StatisticUtil.getStyles(statistic);
      },
      function(error) {
        console.error('Error getting statistic:' + error);
      });


    PhraseService.findAll(limit).then(function(phrases){
      editorCtrl.phrases = phrases;
    });

    this.settings = UserService.settings.editor;
  }

  angular
    .module('app')
    .controller('EditorCtrl', EditorCtrl);
})();

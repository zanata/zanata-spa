(function () {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl (UserService, PhraseService, DocumentService,
    ContextService, LocaleService) {
    var limit = 50,
      editorCtrl = this;

    //perform login
    //UserService.login('aeng', '79834005e9a0206453cdc9f0a33aef66');

        //http://localhost:8080/zanata/app/?projectSlug=projectName&versionSlug=versionName&docId=docId&localeId=en
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

    PhraseService.findAll(limit).then(function(phrases){
      editorCtrl.phrases = phrases;
    });

    this.settings = UserService.settings.editor;
  }

  angular
    .module('app')
    .controller('EditorCtrl', EditorCtrl);
})();

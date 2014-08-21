'use strict';

(function () {

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl (UserService, PhraseService, DocumentService, UrlService) {
    var limit = 50,
      editorCtrl = this;

    //hard code for testing
    var projectSlug = 'anaconda', versionSlug = '19.31.17';
//  var username = 'aeng', apiKey = '79834005e9a0206453cdc9f0a33aef66';

    //perform login
//  UserService.login(username, apiKey);

    editorCtrl.editorContext = function() {
      var projectSlug, versionSlug, docId, localeId;
    };

    PhraseService.findAll(limit).then(function(phrases){
      editorCtrl.phrases = phrases;
    });

    DocumentService.findAll(projectSlug, versionSlug).then(function(documents){
      editorCtrl.documents = documents;
    });

    editorCtrl.editorContext.projectSlug = UrlService.readValue('projectSlug');
    editorCtrl.editorContext.versionSlug = UrlService.readValue('versionSlug');
    editorCtrl.editorContext.docId = UrlService.readValue('docId');
    editorCtrl.editorContext.localeId = UrlService.readValue('localeId');

    console.info(editorCtrl.editorContext.projectSlug);
    console.info(editorCtrl.editorContext.versionSlug);
    console.info(editorCtrl.editorContext.docId);
    console.info(editorCtrl.editorContext.localeId);

    this.settings = UserService.settings.editor;
  }

  angular
    .module('app')
    .controller('EditorCtrl', EditorCtrl);

})();

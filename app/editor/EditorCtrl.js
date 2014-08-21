'use strict';

(function () {

/**
 * EditorCtrl.js
 * @ngInject
 */
function EditorCtrl (UserService, PhraseService, DocumentService) {
  var limit = 50,
      editorCtrl = this;

  //hard code for testing
  var projectSlug = 'anaconda', versionSlug = '19.31.17';
  var username = 'aeng', apiKey = '79834005e9a0206453cdc9f0a33aef66';

  //perform login
  UserService.login(username, apiKey);

  PhraseService.findAll(limit).then(function(phrases){
    editorCtrl.phrases = phrases;
  });

  DocumentService.findAll(projectSlug, versionSlug).then(function(documents){
    editorCtrl.documents = documents;
  });

  this.settings = UserService.settings.editor;
}

angular
  .module('app')
  .controller('EditorCtrl', EditorCtrl);

})();

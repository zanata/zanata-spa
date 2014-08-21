'use strict';

(function () {

/**
 * EditorCtrl.js
 * @ngInject
 */
function EditorCtrl (UserService, PhraseService, DocumentService) {
  var limit = 50,
      editorCtrl = this;

  //perform login
  UserService.login('aeng', '79834005e9a0206453cdc9f0a33aef66');

  PhraseService.findAll(limit).then(function(phrases){
    editorCtrl.phrases = phrases;
  });

  DocumentService.findAll().then(function(documents){
    editorCtrl.documents = documents;
  });

  this.settings = UserService.settings.editor;
}

angular
  .module('app')
  .controller('EditorCtrl', EditorCtrl);

})();

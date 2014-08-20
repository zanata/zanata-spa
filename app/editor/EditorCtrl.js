'use strict';

(function () {

/**
 * EditorCtrl.js
 * @ngInject
 */
function EditorCtrl (UserService, PhraseService) {
  var limit = 50,
      editorCtrl = this;

  PhraseService.findAll(limit).then(function(phrases){
    editorCtrl.phrases = phrases;
  });

  this.settings = UserService.settings.editor;
}

angular
  .module('app')
  .controller('EditorCtrl', EditorCtrl);

})();

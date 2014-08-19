(function () {

/**
 * EditorCtrl.js
 * @ngInject
 */
function EditorCtrl (UserService, PhraseService) {
  var limit = 50,
      self = this;

  PhraseService.findAll(limit).then(function(phrases){
    self.phrases = phrases;
  });

  this.settings = UserService.settings.editor;
}

angular
  .module('app')
  .controller('EditorCtrl', EditorCtrl);

})();

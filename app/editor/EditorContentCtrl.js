(function() {
  'use strict';

  /**
   * EditorContentCtrl.js
   * @ngInject
   */
  function EditorContentCtrl(PhraseService, $stateParams, UrlService) {
    var maxResult = 50,
      editorContentCtrl = this,
      states = UrlService.readValue('states');

    //wrapper for all types of filtering
    var filter = {
      'states': states ? states.split(' ') : states
    };

    loadPhrases($stateParams.projectSlug, $stateParams.versionSlug,
      $stateParams.docId, $stateParams.localeId, filter);

    /**
     * Load transUnit
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    function loadPhrases(projectSlug, versionSlug, docId, localeId, filter) {

      PhraseService.getStates(projectSlug, versionSlug, docId, localeId).then(
        function(states) {
          PhraseService.states = states;

          PhraseService.getPhrase(localeId, filter, 0, maxResult)
            .then(function(phrases) {
              editorContentCtrl.phrases = phrases;
            });
        }
      );
    }

    return editorContentCtrl;
  }

  angular
    .module('app')
    .controller('EditorContentCtrl', EditorContentCtrl);
})();

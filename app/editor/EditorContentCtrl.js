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

    loadPhrases(editorContextHelper($stateParams), filter);

    /**
     * Load transUnit
     *
     * @param helperFn
     * @param filter
     */
    function loadPhrases(helperFn, filter) {

      PhraseService.getStates(helperFn.projectSlug, helperFn.versionSlug,
        helperFn.docId, helperFn.localeId).then(
        function(states) {
          PhraseService.states = states;

          PhraseService.getPhrase(helperFn.localeId, filter, 0, maxResult)
            .then(function(phrases) {
              editorContentCtrl.phrases = phrases;
            });
        }
      );
    }

    function editorContextHelper($stateParams) {
      return {
        projectSlug: $stateParams.projectSlug,
        versionSlug: $stateParams.versionSlug,
        docId: $stateParams.docId,
        localeId: $stateParams.localeId
      }
    }

    return editorContentCtrl;
  }

  angular
    .module('app')
    .controller('EditorContentCtrl', EditorContentCtrl);
})();

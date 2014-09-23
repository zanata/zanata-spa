(function() {
  'use strict';

  /**
   * EditorContentCtrl.js
   * @ngInject
   */
  function EditorContentCtrl(PhraseService, UrlService, EventService,
                             $stateParams) {
    var maxResult = 50,
        editorContentCtrl = this,
        states = UrlService.readValue('states');
    editorContentCtrl.phrases = [];

    //wrapper for all types of filtering
    var filter = {
      'states': states ? states.split(' ') : states
    };

    init($stateParams.projectSlug, $stateParams.versionSlug,
      $stateParams.docId, $stateParams.localeId, filter);

    /**
     * Load transUnit
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    function init(projectSlug, versionSlug, docId, localeId, filter) {

      EventService.emitEvent(EventService.EVENT.REFRESH_STATISTIC,
        {
          projectSlug: projectSlug,
          versionSlug: versionSlug,
          docId: docId,
          localeId: localeId
        }
      );

      PhraseService.fetchAllPhrase(projectSlug, versionSlug, docId, localeId,
        filter, states, 0, maxResult)
        .then(displayPhrases);
    }

    function displayPhrases(phrases) {
      editorContentCtrl.phrases = phrases;
    }

    return editorContentCtrl;
  }

  angular
    .module('app')
    .controller('EditorContentCtrl', EditorContentCtrl);
})();

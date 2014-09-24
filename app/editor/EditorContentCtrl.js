(function() {
  'use strict';

  /**
   * EditorContentCtrl.js
   * @ngInject
   */
  function EditorContentCtrl(EditorService, PhraseService, UrlService,
                             EventService, $stateParams) {
    var maxResult = 50,
        editorContentCtrl = this,
        states = UrlService.readValue('states');
    editorContentCtrl.phrases = [];

    //wrapper for all types of filtering
    var filter = {
      'states': states ? states.split(' ') : states
    };

    EditorService.updateContext($stateParams.projectSlug,
      $stateParams.versionSlug, $stateParams.docId, $stateParams.localeId);

    init(EditorService.context, filter);

    /**
     * Load transUnit
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    function init(context, filter) {

      EventService.emitEvent(EventService.EVENT.REFRESH_STATISTIC,
        {
          projectSlug: context.projectSlug,
          versionSlug: context.versionSlug,
          docId: context.docId,
          localeId: context.localeId
        }
      );

      PhraseService.fetchAllPhrase(context, filter, states, 0, maxResult)
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

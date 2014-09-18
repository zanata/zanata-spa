(function() {
  'use strict';

  /**
   * EditorContentCtrl.js
   * @ngInject
   */
  function EditorContentCtrl(PhraseService, $stateParams) {
    var limit = 50,
        editorContentCtrl = this;

    /**
     * Load transUnit
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    function loadPhases(projectSlug, versionSlug, docId, localeId) {
      PhraseService.findAll(limit, projectSlug, versionSlug, docId, localeId)
        .then(function(phrases) {
          //TODO: need to move data to cacheService,
          // so it can be access by other service
          editorContentCtrl.phrases = phrases;
        });
    }

    loadPhases($stateParams.projectSlug,
      $stateParams.versionSlug,
      $stateParams.docId, $stateParams.localeId);

    return editorContentCtrl;
  }

  angular
    .module('app')
    .controller('EditorContentCtrl', EditorContentCtrl);
})();

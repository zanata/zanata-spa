(function() {
  'use strict';

  /**
   * EditorContentCtrl.js
   * @ngInject
   */
  function EditorContentCtrl(EditorService, PhraseService, UrlService,
                             EventService, $stateParams) {
    var COUNT_PER_LOAD = 50,
        MAX_CACHE_SIZE = COUNT_PER_LOAD * 2,
        phraseOffset = 0,
        editorContentCtrl = this,
        states = UrlService.readValue('states');
    editorContentCtrl.phrases = [];
    editorContentCtrl.fixHeight = 0;

    //wrapper for all types of filtering
    var filter = {
      'states': states ? states.split(' ') : states
    };

    EditorService.updateContext($stateParams.projectSlug,
      $stateParams.versionSlug, $stateParams.docId, $stateParams.localeId);

    init(filter);

    editorContentCtrl.loadNext = function() {
//      PhraseService.fetchAllPhrase(EditorService.context, filter, phraseOffset,
//        COUNT_PER_LOAD).then(displayPhrases);
      displayPhrases(editorContentCtrl.phrases);
    };

    editorContentCtrl.loadPrevious = function() {
      console.log('load previous');
    };

    /**
     * Load transUnit
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    function init(filter) {

      EventService.emitEvent(EventService.EVENT.REFRESH_STATISTIC,
        {
          projectSlug: EditorService.context.projectSlug,
          versionSlug: EditorService.context.versionSlug,
          docId: EditorService.context.docId,
          localeId: EditorService.context.localeId
        }
      );

      PhraseService.fetchAllPhrase(EditorService.context, filter,
        phraseOffset, COUNT_PER_LOAD).then(displayPhrases);
    }

    function displayPhrases(phrases, insertOnTop) {
      if(insertOnTop) {

      } else {
        phraseOffset = phraseOffset + phrases.length;
        editorContentCtrl.phrases.push.apply(editorContentCtrl.phrases,
          phrases);

        //remove entry from cache if size > MAX_CACHE_SIZE
        if(editorContentCtrl.phrases.length > MAX_CACHE_SIZE) {
          var startIndex = editorContentCtrl.phrases.length - MAX_CACHE_SIZE;
            editorContentCtrl.phrases = editorContentCtrl.phrases.slice(
              startIndex, editorContentCtrl.phrases.length);

          editorContentCtrl.fixHeight = editorContentCtrl.fixHeight + (165 * startIndex);

          console.log('trim:' + editorContentCtrl.fixHeight);
        }
      }

    }

    return editorContentCtrl;
  }

  angular
    .module('app')
    .controller('EditorContentCtrl', EditorContentCtrl);
})();

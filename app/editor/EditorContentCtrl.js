(function() {
  'use strict';

  /**
   * EditorContentCtrl.js
   * @ngInject
   */
  function EditorContentCtrl($rootScope, EditorService, PhraseService,
                             UrlService, EventService, $stateParams) {

    //TODO: move pager to directives/convert to infinite scroll
    var COUNT_PER_PAGE = 50,
        editorContentCtrl = this,
        states = UrlService.readValue('states'),
        isLastPage = false,
        filter = {
          'states': states ? states.split(' ') : states
        };

    editorContentCtrl.phrases = [];

    EditorService.updateContext($stateParams.projectSlug,
      $stateParams.versionSlug, $stateParams.docId, $stateParams.localeId);

    init();

    $rootScope.$on(EventService.EVENT.GOTO_PREV_PAGE,
      function () {
        if(EditorService.currentPageIndex > 0) {
          EditorService.currentPageIndex -= 1;
          loadPhrase(EditorService.currentPageIndex);
        }
      });

    $rootScope.$on(EventService.EVENT.GOTO_NEXT_PAGE,
      function () {
        if(!isLastPage && editorContentCtrl.phrases.length === COUNT_PER_PAGE) {
          EditorService.currentPageIndex +=1;
          loadPhrase(EditorService.currentPageIndex);
        }
      });

    /**
     * Load transUnit
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    function init() {
      EventService.emitEvent(EventService.EVENT.REFRESH_STATISTIC,
        {
          projectSlug: EditorService.context.projectSlug,
          versionSlug: EditorService.context.versionSlug,
          docId: EditorService.context.docId,
          localeId: EditorService.context.localeId
        }
      );
      loadPhrase(EditorService.currentPageIndex);
    }

    function loadPhrase(pageIndex) {
      var startIndex = pageIndex * COUNT_PER_PAGE;
      PhraseService.fetchAllPhrase(EditorService.context, filter,
        startIndex, COUNT_PER_PAGE).then(displayPhrases);
    }

    function displayPhrases(phrases) {
      editorContentCtrl.phrases = phrases;
      isLastPage = phrases.length < COUNT_PER_PAGE;
    }

    return editorContentCtrl;
  }

  angular
    .module('app')
    .controller('EditorContentCtrl', EditorContentCtrl);
})();

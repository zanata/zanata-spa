(function() {
  'use strict';

  /**
   * EditorContentCtrl.js
   * @ngInject
   */
  function EditorContentCtrl($rootScope, EditorService, PhraseService,
                             DocumentService, UrlService, EventService,
                             $stateParams) {

    //TODO: move pager to directives/convert to infinite scroll
    var COUNT_PER_PAGE = 50,
        editorContentCtrl = this,
        states = UrlService.readValue('states'),
        filter = {
          'states': states ? states.split(' ') : states
        };

    editorContentCtrl.phrases = [];

    EditorService.updateContext($stateParams.projectSlug,
      $stateParams.versionSlug, DocumentService.decodeDocId($stateParams.docId),
      $stateParams.localeId);

    init();

    $rootScope.$on(EventService.EVENT.GOTO_FIRST_PAGE,
      function () {
        if(EditorService.currentPageIndex > 0) {
          EditorService.currentPageIndex = 0;
          changePage(EditorService.currentPageIndex);
        }
      });

    $rootScope.$on(EventService.EVENT.GOTO_PREV_PAGE,
      function () {
        if(EditorService.currentPageIndex > 0) {
          EditorService.currentPageIndex -= 1;
          changePage(EditorService.currentPageIndex);
        }
      });

    $rootScope.$on(EventService.EVENT.GOTO_NEXT_PAGE,
      function () {
        if(EditorService.currentPageIndex < EditorService.maxPageIndex) {
          EditorService.currentPageIndex +=1;
          changePage(EditorService.currentPageIndex);
        }
      });

    $rootScope.$on(EventService.EVENT.GOTO_LAST_PAGE,
      function () {
        if(EditorService.currentPageIndex < EditorService.maxPageIndex) {
          EditorService.currentPageIndex = EditorService.maxPageIndex;
          changePage(EditorService.currentPageIndex);
        }
      });

    function changePage(pageIndex) {
      loadPhrase(pageIndex);
      EventService.emitEvent(EventService.EVENT.CANCEL_EDIT);
    }

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

      PhraseService.getPhraseCount(EditorService.context, filter).
        then(function(count) {
          EditorService.maxPageIndex = parseInt(count / COUNT_PER_PAGE);
          if(count > COUNT_PER_PAGE) {
            EditorService.maxPageIndex = count % COUNT_PER_PAGE !== 0 ?
              EditorService.maxPageIndex +=1 : EditorService.maxPageIndex;
          }

          EditorService.maxPageIndex =  EditorService.maxPageIndex -1 < 0 ? 0 :
            EditorService.maxPageIndex -1;

          loadPhrase(EditorService.currentPageIndex);
      });
    }

    function loadPhrase(pageIndex) {
      var startIndex = pageIndex * COUNT_PER_PAGE;
      PhraseService.fetchAllPhrase(EditorService.context, filter,
        startIndex, COUNT_PER_PAGE).then(displayPhrases);
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

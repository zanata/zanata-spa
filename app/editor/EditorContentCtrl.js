(function() {
  'use strict';

  /**
   * EditorContentCtrl.js
   * @ngInject
   */
  function EditorContentCtrl($rootScope, EditorService, PhraseService,
                             DocumentService, UrlService, EventService,
                             $stateParams, TransUnitService, _,
                             TransStatusService) {

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

    /*
      TODO: after moving to infinite scroll, all these go to event handler
      should move back to TransUnitService and use PhraseService.findNextId etc
     */
    // EventService.EVENT.GOTO_NEXT_ROW listener
    $rootScope.$on(EventService.EVENT.GOTO_NEXT_ROW, goToNextRow);

    // EventService.EVENT.GOTO_PREVIOUS_ROW listener
    $rootScope.$on(EventService.EVENT.GOTO_PREVIOUS_ROW, goToPreviousRow);

    // EventService.EVENT.GOTO_NEXT_UNTRANSLATED listener
    $rootScope.$on(EventService.EVENT.GOTO_NEXT_UNTRANSLATED,
                   goToNextUntranslated);

    function goToNextRow(event, data) {
      var phrases = editorContentCtrl.phrases,
        currentIndex,
        nextIndex,
        nextId;

      currentIndex = _.findIndex(phrases, function (phrase) {
        return phrase.id === data.currentId;
      });
      nextIndex = Math.min(currentIndex + 1, phrases.length - 1);
      nextId = phrases[nextIndex].id;

      if (nextId !== data.currentId) {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
                               {
                                 'id': nextId,
                                 'updateURL': true,
                                 'focus': true
                               }, null);
      } else {
        // we have reach the end
        TransUnitService.saveCurrentRowIfModifiedAndUnfocus(data);
      }
    }

    function goToPreviousRow(event, data) {
      var phrases = editorContentCtrl.phrases,
        currentIndex,
        previousIndex,
        prevId;

      currentIndex = _.findIndex(phrases, function (phrase) {
        return phrase.id === data.currentId;
      });
      previousIndex = Math.max(currentIndex - 1, 0);
      prevId = phrases[previousIndex].id;

      if (prevId !== data.currentId) {
        EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
                               {
                                 'id': prevId,
                                 'updateURL': true,
                                 'focus': true
                               }, null);
      } else {
        // have have reach the start
        TransUnitService.saveCurrentRowIfModifiedAndUnfocus(data);
      }
    }

    function goToNextUntranslated(event, data) {
      var phrases = editorContentCtrl.phrases,
        requestStatus = TransStatusService.getStatusInfo(status),
        currentIndex,
        nextStatusInfo;

      currentIndex = _.findIndex(phrases, function (phrase) {
        return phrase.id === data.currentId;
      });

      for (var i = currentIndex + 1; i < phrases.length; i++) {
        nextStatusInfo = TransStatusService.getStatusInfo(
          phrases[i].state);
        if (nextStatusInfo.ID === requestStatus.ID) {
          EventService.emitEvent(EventService.EVENT.SELECT_TRANS_UNIT,
                                 {
                                   'id': phrases[i].id,
                                   'updateURL': true,
                                   'focus': true
                                 }, null);
        }
      }
      // can not find next untranslated
      TransUnitService.saveCurrentRowIfModifiedAndUnfocus(data);
    }

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

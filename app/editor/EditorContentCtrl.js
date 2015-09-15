(function() {
  'use strict';

  /**
   * EditorContentCtrl.js
   * @ngInject
   */
  function EditorContentCtrl($rootScope, EditorService, PhraseService,
                             DocumentService, UrlService, EventService,
                             $stateParams, PhraseUtil, $location, _,
                             TransStatusService) {

    //TODO: move pager to directives/convert to infinite scroll
    var COUNT_PER_PAGE = 50,
      editorContentCtrl = this, status, filter;
    refreshFilterQueryFromUrl();

    editorContentCtrl.phrases = [];

    EditorService.updateContext($stateParams.projectSlug,
      $stateParams.versionSlug, DocumentService.decodeDocId($stateParams.docId),
      $stateParams.localeId);

    init();

    $rootScope.$on(EventService.EVENT.FILTER_TRANS_UNIT,
      function (event, filterInfo) {
        if(filterInfo.status.all === true) {
          $location.search('status', null);
        } else {
          var queries = [];
          _.forEach(filterInfo.status, function(val, key) {
            if(val) {
              queries.push(key);
            }
          });
          $location.search('status', queries.join(','));
        }
        refreshFilterQueryFromUrl();
        init();
      });

    function refreshFilterQueryFromUrl() {
      status = UrlService.readValue('status');

      if(!_.isUndefined(status)) {
        status = status.split(',');
        status = _.transform(status, function(result, state) {
          state = TransStatusService.getServerId(state);
          return result.push(state);
        });
      }
      filter = {
        'status': status
      };
    }


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
        if(!_.isNull(EditorService.maxPageIndex) &&
           EditorService.currentPageIndex < EditorService.maxPageIndex) {
          EditorService.currentPageIndex++;
          changePage(EditorService.currentPageIndex);
        }
      });

    $rootScope.$on(EventService.EVENT.GOTO_LAST_PAGE,
      function () {
        if(!_.isNull(EditorService.maxPageIndex) &&
           EditorService.currentPageIndex < EditorService.maxPageIndex) {
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
        phrase,
        currentIndex,
        nextIndex,
        nextId;

      currentIndex = _.findIndex(phrases, function (searchPhrase) {
        return searchPhrase.id === data.currentId;
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
        phrase = phrases[currentIndex];
        EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
          {
            'phrase': phrase,
            'status': PhraseUtil.getSaveButtonStatus(phrase),
            'locale': $stateParams.localeId,
            'docId': $stateParams.docId
          });
      }
    }

    function goToPreviousRow(event, data) {
      var phrases = editorContentCtrl.phrases,
        phrase,
        currentIndex,
        previousIndex,
        prevId;

      currentIndex = _.findIndex(phrases, function (searchPhrase) {
        return searchPhrase.id === data.currentId;
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
        phrase = phrases[currentIndex];
        // have reach the start
        EventService.emitEvent(EventService.EVENT.SAVE_TRANSLATION,
          {
            'phrase': phrase,
            'status': PhraseUtil.getSaveButtonStatus(phrase),
            'locale': $stateParams.localeId,
            'docId': $stateParams.docId
          });
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
          return;
        }
      }
      // can not find next untranslated
      //TransUnitService.saveCurrentRowIfModifiedAndUnfocus(data);
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

      PhraseService.getPhraseCount(EditorService.context, filter)
        .then(function(count) {
          var maxPage = Math.ceil(count / COUNT_PER_PAGE);

          // page number is 1-based, index is 0-based
          EditorService.maxPageIndex = maxPage > 0 ? maxPage - 1 : null;

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

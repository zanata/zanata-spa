(function () {
  'use strict';

  /**
   * EditorService.js
   * //TODO: parse editorContext in functions
   * @ngInject
   */
  function EditorService($rootScope, $resource, _, UrlService,
    EventService, PhraseService, DocumentService, MessageHandler,
    TransStatusService, TransUnitService) {
    var editorService = this,
        queue = {};

    editorService.context = {};

    editorService.currentPageIndex = 0;

    editorService.initContext =
      function (projectSlug, versionSlug, docId, srcLocale, localeId, mode) {
        editorService.context = {
          projectSlug: projectSlug,
          versionSlug: versionSlug,
          docId: docId,
          srcLocale: srcLocale,
          localeId: localeId,
          mode: mode // READ_WRITE, READ_ONLY, REVIEW
        };
        return editorService.context;
      };

    editorService.updateContext = function(projectSlug, versionSlug, docId,
                                           localeId) {
      if(editorService.context.projectSlug !== projectSlug) {
        editorService.context.projectSlug = projectSlug;
      }
      if(editorService.context.versionSlug !== versionSlug) {
        editorService.context.versionSlug = versionSlug;
      }
      if(editorService.context.docId !== docId) {
        editorService.context.docId = docId;
      }
      if(editorService.context.localeId !== localeId) {
        editorService.context.localeId = localeId;
      }
    };

    /**
     * EventService.EVENT.SAVE_TRANSLATION listener
     * Perform save translation with given status
     *
     * - queue save translation request (1 global queue, 1 for each TU)
     * - if queue contains request id, replace old request with new request
     */
    $rootScope.$on(EventService.EVENT.SAVE_TRANSLATION,
      function (event, data) {
        var phrase = data.phrase,
            status = data.status;

        EventService.emitEvent(EventService.EVENT.SAVE_INITIATED, data);

        //update pending queue if contains
        if(_.has(queue,  phrase.id)) {
          var pendingRequest = queue[phrase.id];
          pendingRequest.phrase = phrase;
          pendingRequest.status = status;
          processSaveRequest(phrase.id);
        } else if(TransUnitService.isTranslationModified(phrase) ||
          phrase.status !== status) {
          status = resolveTranslationState(phrase, status);
          queue[phrase.id] = {
            'phrase': phrase,
            'status' : status,
            'locale': data.locale,
            'docId' : data.docId
          };
          processSaveRequest(phrase.id);
        }
      });

    // Process save translation request
    function processSaveRequest(id) {
      var request = queue[id];

      var Translation = $resource(UrlService.TRANSLATION_URL, {}, {
        update: {
          method: 'PUT',
          params: {
            localeId: request.locale
          }
        }
      });

      var data = {
        id: request.phrase.id,
        revision: request.phrase.revision,
        content: request.phrase.newTranslation,
        // Return status object to PascalCase Id for the server
        status: TransStatusService.getServerId(request.status.ID),
        plurals: []
      };

      Translation.update(data).$promise.then(
        function(response) {
          var oldStatus =  request.phrase.status;

          PhraseService.onTransUnitUpdated(data.id, request.locale,
            response.revision, response.state, request.phrase.newTranslation);

          DocumentService.updateStatistic(request.docId, request.locale,
            oldStatus, response.state, request.phrase.wordCount);

          EventService.emitEvent(EventService.EVENT.SAVE_COMPLETED,
            request.phrase);
        },
        function(response) {
          MessageHandler.displayWarning('Update translation failed for ' +
            data.id + ' -' + response);
          PhraseService.onTransUnitUpdateFailed(data.id);
          EventService.emitEvent(EventService.EVENT.SAVE_COMPLETED,
            request.phrase);
        });
      delete queue[id];
    }

    function resolveTranslationState(phrase, requestStatus) {
      if(phrase.newTranslation === '') {
        return TransStatusService.getStatusInfo('UNTRANSLATED');
      }
      return requestStatus;
    }

    return editorService;
  }

  angular
    .module('app')
    .factory('EditorService', EditorService);

})();

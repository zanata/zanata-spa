(function() {
  'use strict';

  /**
   * SaveTranslationService.js
   * @ngInject
   *
   */
  function SaveTranslationService($rootScope, $resource, PhraseService,
                                  MessageHandler, UrlService, DocumentService,
                                  EventService, TransUnitService, _) {
    var saveTranslationService = this,
      queue = {};

    /**
     * EventService.EVENT.SAVE_TRANSLATION listener
     * Perform save translation with given state
     *
     * - queue save translation request (1 global queue, 1 for each TU)
     * - if queue contains request id, replace old request with new request
     */
    $rootScope.$on(EventService.EVENT.SAVE_TRANSLATION,
      function (event, data) {
        var phrase = data.phrase,
          state = data.state;
        //update pending queue if contains
        if(_.has(queue,  phrase.id)) {
          var pendingRequest = queue[phrase.id];
          pendingRequest.phrase = phrase;
          pendingRequest.state = state;
          processSaveRequest(phrase.id);
        } else if(isTranslationModified(phrase)) {
          state = resolveTranslationState(phrase, state);
          queue[phrase.id] = {
            'phrase': phrase,
            'state' : state,
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
        state: request.state,
        plurals: []
      };

      Translation.update(data).$promise.then(
        function(response) {
          var oldState =  request.phrase.status;

          PhraseService.onTransUnitUpdated(data.id, request.locale,
            response.revision, response.state, request.phrase.newTranslation);

          DocumentService.updateStatistic(request.docId, request.locale,
            oldState, response.state, request.phrase.wordCount);
        },
        function(response) {
          MessageHandler.displayWarning('Update translation failed for ' +
            data.id + ' -' + response);

          //conflict
          if(response.status === 409) {
            var oldState =  request.phrase.status;

            PhraseService.onTransUnitUpdated(data.id, request.locale,
              response.revision, response.state, response.translation);

            DocumentService.updateStatistic(request.docId, request.locale,
              oldState, response.state, request.phrase.wordCount);
          } else {
            PhraseService.onTransUnitUpdateFailed(data.id);
          }
        });
      delete queue[id];
    }

    function resolveTranslationState(phrase, requestStatus) {
      if(phrase.newTranslation === '') {
        return TransUnitService.TU_STATE.UNTRANSLATED;
      }
      return requestStatus;
    }

    function isTranslationModified(phrase) {
      return phrase.newTranslation !== phrase.translation;
    }

    return saveTranslationService;
  }
  angular
    .module('app')
    .factory('SaveTranslationService', SaveTranslationService);
})();

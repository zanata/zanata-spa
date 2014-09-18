(function() {
  'use strict';

  /**
   * SaveTranslationService.js
   * @ngInject
   *
   */
  function SaveTranslationService($rootScope, UrlService, EventService,
                                  TransUnitService) {
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
          status = data.status;

        //update pending queue if contains
        if(phrase.id in queue) {
          var pendingRequest = queue[phrase.id];
          pendingRequest.phrase = phrase;
          pendingRequest.state = status;
        } else if(isTranslationModified(phrase)) {
          status = resolveTranslationState(phrase, status);
          queue[phrase.id] = {
            'phrase': phrase,
            'state' : status
          }
        }
        processSaveRequest(phrase.id);
      });

    // Process save translation request
    function processSaveRequest(id) {
      var request = queue[id];

      console.log('Perform save translation ' + id + ' as ' + request.state);

      var Translation = $resource(UrlService.TRANSLATION_URL, {}, {
        put: {
          method: 'PUT'
        }
      });

      var data = [{
        id: request.phrase.id,
        revision: request.phrase.revision,
        content: request.phrase.newTranslation,
        state: request.state,
        plurals: []
      }];

      Translation.put(data).$promise.then(translationUpdatedCallback);
      delete queue[id];
    }

    /*
     * Callback for translation update:
     * - update revision, content in cache
     * - update queue if contains tu
     */
    function translationUpdatedCallback(response) {

    }

    function resolveTranslationState(phrase, requestStatus) {
      if(phrase.newTranslation === '') {
        return TransUnitService.TU_STATUS.UNTRANSLATED;
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

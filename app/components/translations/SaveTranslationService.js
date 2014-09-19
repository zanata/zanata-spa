(function() {
  'use strict';

  /**
   * SaveTranslationService.js
   * @ngInject
   *
   */
  function SaveTranslationService($rootScope, $resource, UrlService,
                                  EventService, TransUnitService) {
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
        if(phrase.id in queue) {
          var pendingRequest = queue[phrase.id];
          pendingRequest.phrase = phrase;
          pendingRequest.state = state;
          processSaveRequest(phrase.id);
        } else if(isTranslationModified(phrase)) {
          state = resolveTranslationState(phrase, state);
          queue[phrase.id] = {
            'phrase': phrase,
            'state' : state,
            'locale': data.locale
          };
          processSaveRequest(phrase.id);
        }
      });

    // Process save translation request
    function processSaveRequest(id) {
      var request = queue[id];
      console.log('Perform save translation ' + id + ' as ' + request.state);

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

      Translation.update(data).$promise.then(updatedSuccessCallback,
        updateFailCallback);
      delete queue[id];
    }

    /*
     * Callback for translation update:
     * - update revision, content in cache
     * - update queue if contains tu
     */
    function updatedSuccessCallback(response) {
      console.log(response);
    }

    /**
     * Notify update failure
     *
     * @param response
     */
    function updateFailCallback(response) {
      console.log('translation update fail-' + response);
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

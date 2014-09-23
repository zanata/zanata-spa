(function () {
  'use strict';

  /**
   * EventService.js
   * Broadcast events service in app
   *
   * @ngInject
   */
  function EventService($rootScope) {
    var eventService = this;
    eventService.EVENT = {
      /**
       * data: {}
       * id: (transunit id),
       * updateURL: (flag on whether to update url with trans unit id)
       */
      SELECT_TRANS_UNIT: 'selectTransUnit',

      //data:phrase
      COPY_FROM_SOURCE: 'copyFromSource',

      //data:phrase
      CANCEL_EDIT: 'cancelEdit',

      /**
       * data: {}
       * phrase:
       * state: request save state
       * locale: target locale
       */
      SAVE_TRANSLATION: 'saveTranslation',

      /**
       * refresh ui statistic - changes in doc or locale
       *
       * data: {}
       * projectSlug:
       * versionSlug:
       * docId:
       * localeId:
       */
      REFRESH_STATISTIC: 'refreshStatistic',


      /**
       * Update statistic
       *
       * data:{}
       * docId:
       * localeId:
       *
       * oldState
       * newState
       * wordCount
       */
      UPDATE_STATISTIC: 'updateStatistic'
    };

    /**
     * Firing an event downwards of scope
     *
     * @param event - eventService.EVENT type
     * @param data - data for the event
     * @param scope - scope of event to to fire, $rootScope if empty
     */
    eventService.broadcastEvent = function(event, data, scope) {
      scope = scope || $rootScope;
      scope.$broadcast(event, data);
    };

    /**
     * Firing an event upwards of scope
     *
     * @param event - eventService.EVENT types
     * @param data - data for the event
     * @param scope - scope of event to to fire, $rootScope if empty
     */
    eventService.emitEvent = function(event, data, scope) {
      scope = scope || $rootScope;
      scope.$emit(event, data);
    };

    return eventService;
  }

  angular
    .module('app')
    .factory('EventService', EventService);
})();

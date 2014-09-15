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
      SELECT_TRANS_UNIT: 'selectTransUnit',
      COPY_FROM_SOURCE: 'copyFromSource',
      CANCEL_EDIT: 'cancelEdit',
      SAVE_TRANSLATION: 'saveTranslation'
    };

    /**
     * Firing an event downwards of scope
     *
     * @param event - eventService.EVENT type
     * @param data - data for the event
     * @param scope - scope of event to to fire, $rootScope if empty
     */
    eventService.broadcastEvent = function(event, data, scope) {
      if(scope) {
        scope.$broadcast(event, data);
      } else {
        $rootScope.$broadcast(event, data);
      }
    };

    /**
     * Firing an event upwards of scope
     *
     * @param event - eventService.EVENT types
     * @param data - data for the event
     * @param scope - scope of event to to fire, $rootScope if empty
     */
    eventService.emitEvent = function(event, data, scope) {
      if(scope) {
        scope.$emit(event, data);
      } else {
        $rootScope.$emit(event, data);
      }
    };

    return eventService;
  }

  angular
    .module('app')
    .factory('EventService', EventService);
})();

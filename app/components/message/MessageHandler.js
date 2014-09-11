(function() {
  'use strict';

  /**
   * MessageHandler.js
   * @ngInject
   */
  function MessageHandler() {

    return {
      displayError: function(msg) {
        console.error(msg);
      },
      displayWarning: function(msg) {
        console.warn(msg);
      },
      displayInfo: function(msg) {
        console.info(msg);
      }
    };
  }
  angular
    .module('app')
    .factory('MessageHandler', MessageHandler);
})();

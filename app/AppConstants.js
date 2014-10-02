(function() {
  'use strict';

  /**
   * Root application
   * app.js
   */
  angular
    .module('app')
    .constant('_', window._)
    // Toggle to hide/show features that are ready for production
    .constant('PRODUCTION', true);

})();

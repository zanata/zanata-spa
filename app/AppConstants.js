(function() {
  'use strict';

  /**
   * AddConstants
   * "Global" app variables. Don't worry David, they're not really global.
   */
  angular
    .module('app')
    .constant('_', window._)
    .constant('Mousetrap', window.Mousetrap)
    // Toggle to hide/show features that are ready for production
    .constant('PRODUCTION', true);

})();


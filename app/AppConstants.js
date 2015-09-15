(function () {
  'use strict'

  /**
   * AddConstants
   * "Global" app variables. Don't worry David, they're not really global.
   * We could probably call them something like "app-global".
   * As long as they are immutable and in a scope we control, all is fine.
   */
  angular
    .module('app')
    .constant('_', window._)
    .constant('str', window._.string)
    .constant('Mousetrap', window.Mousetrap)
    // Toggle to hide/show features that are ready for production
    .constant('PRODUCTION', true)
})()

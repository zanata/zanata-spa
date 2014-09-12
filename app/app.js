(function() {
  'use strict';

  /**
   * Root application
   * app.js
   */
  angular.module(
      'app',
      [ 'ui.router',
        'templates',
        'cfp.hotkeys',
        'monospaced.elastic',
        'ngResource',
        'ngAnimate',
        'gettext'
      ]);

})();

(function() {
  'use strict';

  /**
   * Root application
   * app.js
   */
  angular.module(
    'app', [
      'ngResource',
      'ngAnimate',
      'ui.router',
      'templates',
      'cfp.hotkeys',
      'monospaced.elastic',
      'gettext'
    ]).constant('_', window._);

})();

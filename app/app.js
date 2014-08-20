'use strict';

(function () {

/**
 * Root application
 * app.js
 */
angular.module('app',
    ['ui.router',
    'templates',
    'cfp.hotkeys',
    'monospaced.elastic'])
  .config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /editor
    $urlRouterProvider.otherwise('/');

    // $locationProvider
    //   .html5Mode(true)
    //   .hashPrefix('!');

  });

})();

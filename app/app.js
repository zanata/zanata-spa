(function () {
  'use strict'

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
      'focusOn',
      'monospaced.elastic',
      'gettext',
      'diff-match-patch'
    ])
})()

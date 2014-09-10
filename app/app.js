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
        'gettext'
      ]).config(
      function($stateProvider, $urlRouterProvider, $httpProvider) {

        //handles global error for $resource call
        var interceptor = ['$rootScope', '$q', function(scope, $q) {
          function success(response) {
            console.debug('Success');
            return response;
          }
          function error(response) {
            console.error('Unexpected error');
            var status = response.status;
            if (status === 401) {
              console.error('Unauthorized access. Please login');
              return;
            }
            // otherwise
            return $q.reject(response);
          }
          return function(promise) {
            return promise.then(success, error);
          };
        } ];

        $httpProvider.responseInterceptors.push(interceptor);

        // For any unmatched url, redirect to /editor
        $urlRouterProvider.otherwise('/');

        $stateProvider
          .state('editor', {
            url: '/:projectSlug/:versionSlug',
            views: {
              'editor': {
                templateUrl: 'editor/editor.html',
                controller: 'EditorCtrl as editor'
              }
            }
          }).state('editor.selected', {
            url: '/:docId/:localeId',
            views: {
              'editor-content': {
                templateUrl: 'editor/editor-content.html',
                controller: 'EditorContentCtrl as editorContent'
              },
              'editor-suggestions': {
                templateUrl: 'editor/editor-suggestions.html',
                controller: 'EditorSuggestionsCtrl as editorSuggestions'
              },
              'editor-details': {
                templateUrl: 'editor/editor-details.html',
                controller: 'EditorDetailsCtrl as editorDetails'
              }
            }
          });

//        $locationProvider.html5Mode(true);
        //   .hashPrefix('!');

      });

})();

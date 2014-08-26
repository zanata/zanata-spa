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
        'ngResource'
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
          .state('editor-default', {
            url: '/:projectSlug/:versionSlug',
            templateUrl: function($stateParams) {
              console.debug($stateParams);
              return 'editor/editor.html';
            }
          })
          .state('editor-preselected', {
            url: '/:projectSlug/:versionSlug/:docId/:localeId',
            templateUrl: function($stateParams) {
              console.debug($stateParams);
              return 'editor/editor.html';
            }
          });

//        $locationProvider.html5Mode(true);
        //   .hashPrefix('!');

      });

})();

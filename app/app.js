'use strict';

(function() {

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
            console.info('Success');
            return response;
          }

          function error(response) {
            console.error('Unexpected error');
            var status = response.status;
            if (status === 401) {
              console.error('Unauthorized access. Please login');
              //              window.location = './index.html';
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

        // $locationProvider
        //   .html5Mode(true)
        //   .hashPrefix('!');

      });

})();

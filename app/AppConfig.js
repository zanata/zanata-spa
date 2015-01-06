(function() {
  'use strict';

  /**
   * @name AppConfig
   * @description Main config for the entire app
   * @ngInject
   */
  function AppConfig($stateProvider, $urlRouterProvider, $httpProvider,
    hotkeysProvider) {

    var interceptor = function($q, $rootScope) {
      return {
        request: function(config) {
          // See EventService.LOADING_INITIATED
          $rootScope.$broadcast('loadingInitiated');
          return config;
        },
        requestError: function(rejection) {
          console.log('Request error due to ', rejection);
          return $q.reject(rejection);
        },
        response: function(response) {
          // See EventService.LOADING_COMPLETE
          $rootScope.$broadcast('loadingComplete');
          return response || $q.when(response);
        },
        responseError: function(rejection) {
          if (rejection.status === 401) {
            console.error('Unauthorized access. Please login');
          } else if (rejection.status === 404) {
            console.error('Service end point not found- ',
              rejection.config.url);
          } else {
            console.error('Error in response ', rejection);
          }
          return $q.reject(rejection);
        }
      };
    };

    $httpProvider.interceptors.push(interceptor);

    // For any unmatched url, redirect to /editor
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('editor', {
        url: '/:projectSlug/:versionSlug/translate',
        templateUrl: 'editor/editor.html',
        controller: 'EditorCtrl as editor',
        resolve: {
          url : function(UrlService) {
            return UrlService.init();
          }
        }
      }).state('editor.selectedContext', {
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
      }).state('editor.selectedContext.tu', {
        url: '/?id&selected?states',
        reloadOnSearch: false
      });

      hotkeysProvider.includeCheatSheet = false;

  //   $locationProvider.html5Mode(true);
  //     .hashPrefix('!');
  }

  angular
    .module('app')
    .config(AppConfig);

})();




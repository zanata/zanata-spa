(function() {
  'use strict';

  /**
   * @name AppCtrl.config
   * @description Main config for the entire app
   * @ngInject
   */
  function AppConfig($stateProvider, $urlRouterProvider, $httpProvider) {

    var interceptor = ['$q', function($q) {
      return {
        request: function(config) {
          return config;
        },
        requestError: function(rejection) {
          console.log('Request error due to ', rejection);
          return $q.reject(rejection);
        },
        response: function(response) {
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
    }];

    $httpProvider.interceptors.push(interceptor);

    // For any unmatched url, redirect to /editor
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('editor', {
        url: '/:projectSlug/:versionSlug/translate',
        templateUrl: 'editor/editor.html',
        controller: 'EditorCtrl as editor',
        resolve: {
          locales : function(LocaleService) {
            return LocaleService.getAllLocales();
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

  //   $locationProvider.html5Mode(true);
  //     .hashPrefix('!');
  }

  angular
    .module('app')
    .config(AppConfig);

})();

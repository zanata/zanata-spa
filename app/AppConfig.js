(function () {
  'use strict'

  /**
   * @name AppConfig
   * @description Main config for the entire app
   * @ngInject
   */
  function AppConfig ($stateProvider, $urlRouterProvider, $httpProvider,
    hotkeysProvider) {
    // Can't use injection for EventService as this module is out of the scope
    var interceptor = function ($q, $rootScope) {
      return {
        request: function (config) {
          // See EventService.EVENT.LOADING_START
          $rootScope.$broadcast('loadingStart')
          return config
        },
        requestError: function (rejection) {
          // See EventService.EVENT.LOADING_STOP
          $rootScope.$broadcast('loadingStop')
          console.error('Request error due to ', rejection)
          return $q.reject(rejection)
        },
        response: function (response) {
          // See EventService.EVENT.LOADING_STOP
          $rootScope.$broadcast('loadingStop')
          return response || $q.when(response)
        },
        responseError: function (rejection) {
          // See EventService.EVENT.LOADING_STOP
          $rootScope.$broadcast('loadingStop')
          if (rejection.status === 401) {
            console.error('Unauthorized access. Please login')
          } else if (rejection.status === 404) {
            console.error('Service end point not found- ',
              rejection.config.url)
          } else {
            console.error('Error in response ', rejection)
          }
          return $q.reject(rejection)
        }
      }
    }

    $httpProvider.interceptors.push(interceptor)

    // For any unmatched url, redirect to /editor
    $urlRouterProvider.otherwise('/')

    $stateProvider
      .state('editor', {
        url: '/:projectSlug/:versionSlug/translate',
        templateUrl: 'editor/editor.html',
        controller: 'EditorCtrl as editor',
        resolve: {
          url: function (UrlService) {
            return UrlService.init()
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
      })

    hotkeysProvider.includeCheatSheet = false

  //   $locationProvider.html5Mode(true)
  //     .hashPrefix('!')
  }

  angular
    .module('app')
    .config(AppConfig)
})()

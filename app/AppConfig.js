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

      hotkeysProvider.template = '' +
        '<div class="Modal" ng-class="{\'is-active\': helpVisible}">' +
          '<div class="Modal-dialog">' +
            '<div class="Modal-header">' +
              '<h2 class="Modal-title">Keyboard Shortcuts</h2>' +
              '<button class="Modal-close Link Link--neutral"' +
              ' ng-click="toggleCheatSheet()">' +
              '<icon name="cross" title="Close"></icon></button>' +
            '</div>' +
            '<div class="Modal-content u-sP-1">' +
              '<ul>' +
                '<li class="Grid" ng-repeat="hotkey in hotkeys | ' +
                'filter:{ description: \'!$$undefined$$\' }">' +
                  '<div class="Grid-cell u-sm-size1of2 u-size1of3 u-sPR-1-4 ' +
                    'u-sPV-1-4 u-textRight">' +
                    '<kbd ng-repeat="key in hotkey.format() track by $index"' +
                    '>{{ key }}</kbd>' +
                  '</div>' +
                  '<div class="Grid-cell u-sm-size1of2 u-size2of3 u-sPL-1-4' +
                    ' u-sPV-1-4">' +
                  '{{ hotkey.description }}</div>' +
                '</li>' +
                '<li class="Grid">' +
                  '<div class="Grid-cell u-sm-size1of2 u-size1of3 u-sPR-1-4 ' +
                    'u-sPV-1-4 u-textRight">' +
                    '<kbd>Tab + U</kbd>' +
                  '</div>' +
                  '<div class="Grid-cell u-sm-size1of2 u-size2of3 u-sPL-1-4' +
                    ' u-sPV-1-4">Save and go to next untranslated string' +
                  '</div>' +
                '</li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>';

  //   $locationProvider.html5Mode(true);
  //     .hashPrefix('!');
  }

  angular
    .module('app')
    .config(AppConfig);

})();




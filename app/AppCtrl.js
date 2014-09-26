(function() {
  'use strict';

  /**
   * @name AppCtrl
   * @description Main controler for the entire app
   * @ngInject
   */
  function AppCtrl($scope, UserService, UrlService, LocaleService,
                   MessageHandler, gettextCatalog, StringUtil) {
    var appCtrl = this;

    appCtrl.settings = UserService.settings;
    appCtrl.uiLocaleList = [ LocaleService.DEFAULT_LOCALE ];
    appCtrl.loading = true;

    $scope.$on('$stateChangeStart', function(event, toState) {
      appCtrl.loading = true;
      if (toState.resolve) {
        // TODO: Move to here
      }
    });

    $scope.$on('$stateChangeSuccess', function(event, toState) {
      appCtrl.loading = false;
      if (toState.resolve) {
        // TODO: Move to here
      }
    });

    UserService.getMyInfo().then(
      function(myInfo) {
        appCtrl.myInfo = myInfo;
        appCtrl.myInfo.locale = LocaleService.DEFAULT_LOCALE;
        appCtrl.myInfo.gravatarUrl = UrlService.gravatarUrl(
          appCtrl.myInfo.gravatarHash, 72);

        loadUILocale();
      }, function(error) {
        MessageHandler.displayInfo('Error loading my info: ' + error);
      });

    // On UI locale changes listener
    appCtrl.onChangeUILocale = function(locale) {
      appCtrl.myInfo.locale = locale;
      var uiLocaleId = appCtrl.myInfo.locale.localeId;
      if (!StringUtil.startsWith(uiLocaleId,
        LocaleService.DEFAULT_LOCALE.localeId, true)) {
        gettextCatalog.loadRemote(UrlService.uiTranslationURL(uiLocaleId))
            .then(
                function() {
                  gettextCatalog.setCurrentLanguage(uiLocaleId);
                },
                function(error) {
                  MessageHandler.displayInfo('Error loading UI locale. ' +
                    'Default to \'' + LocaleService.DEFAULT_LOCALE.displayName +
                    '\': ' + error);
                  gettextCatalog.setCurrentLanguage(
                    LocaleService.DEFAULT_LOCALE);
                  appCtrl.myInfo.locale = LocaleService.DEFAULT_LOCALE;
                });
      } else {
        gettextCatalog.setCurrentLanguage(
          LocaleService.DEFAULT_LOCALE.localeId);
      }
    };

    function loadUILocale() {
      LocaleService.getUILocaleList().then(
        function(translationList) {
          for ( var i in translationList.locales) {
            var language = {
              'localeId' : translationList.locales[i],
              'displayName' : ''
            };
            appCtrl.uiLocaleList.push(language);
          }
          appCtrl.myInfo.locale = LocaleService.getLocaleByLocaleId(
            appCtrl.uiLocaleList, LocaleService.DEFAULT_LOCALE.localeId);
          if (!appCtrl.myInfo.locale) {
            appCtrl.myInfo.locale = LocaleService.DEFAULT_LOCALE;
          }
        },
        function(error) {
          MessageHandler.displayInfo('Error loading UI locale. ' +
            'Default to \'' + LocaleService.DEFAULT_LOCALE.displayName +
            '\': ' + error);
          appCtrl.myInfo.locale = LocaleService.DEFAULT_LOCALE;
        });
    }
  }

  AppCtrl.config = function($stateProvider, $urlRouterProvider, $httpProvider) {

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
        url: '/:docId/:localeId?id&selected?states',
        reloadOnSearch: false,
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

  //   $locationProvider.html5Mode(true);
  //     .hashPrefix('!');

  };

  angular
    .module('app')
    .controller('AppCtrl', AppCtrl)
    .config(AppCtrl.config);

})();

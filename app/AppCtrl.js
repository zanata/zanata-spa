(function() {
  'use strict';

  /**
   * @name AppCtrl
   * @description Main controler for the entire app
   * @ngInject
   */
  function AppCtrl($scope, UserService, UrlService, LocaleService,
                   MessageHandler, gettextCatalog, StringUtil, PRODUCTION,
                   EditorShortcuts) {
    var appCtrl = this;

    // See AppConstants.js
    appCtrl.PRODUCTION = PRODUCTION;
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
      EditorShortcuts.enableKeysForState(toState);
      if (toState.resolve) {
        // TODO: Move to here
      }
    });

    UrlService.init().then(loadLocales).
      then(loadUserInformation).
      then(loadUILocale);

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
                    'Default to \'' + LocaleService.DEFAULT_LOCALE.name +
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

    appCtrl.dashboardPage = function() {
      return UrlService.DASHBOARD_PAGE;
    };

    function loadLocales() {
      return LocaleService.getAllLocales();
    }

    function loadUserInformation() {
      return UserService.getMyInfo().then(
        function(myInfo) {
          appCtrl.myInfo = myInfo;
          appCtrl.myInfo.locale = LocaleService.DEFAULT_LOCALE;
          appCtrl.myInfo.gravatarUrl = UrlService.gravatarUrl(
            appCtrl.myInfo.gravatarHash, 72);
        }, function(error) {
          MessageHandler.displayError('Error loading my info: ' + error);
        });
    }

    function loadUILocale() {
      LocaleService.getUILocaleList().then(
        function(translationList) {
          for ( var i in translationList.locales) {
            var language = {
              'localeId' : translationList.locales[i],
              'name' : ''
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
            'Default to \'' + LocaleService.DEFAULT_LOCALE.name +
            '\': ' + error);
          appCtrl.myInfo.locale = LocaleService.DEFAULT_LOCALE;
        });
    }
  }

  angular
    .module('app')
    .controller('AppCtrl', AppCtrl);

})();


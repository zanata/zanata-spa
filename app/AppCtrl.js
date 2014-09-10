(function() {
  'use strict';

  /**
   * @name AppCtrl
   * @description Main controler for the entire app
   * @ngInject
   */
  function AppCtrl(UserService, UrlService, LocaleService, MessageHandler,
      gettextCatalog, StringUtil) {
    this.settings = UserService.settings;
    var appCtrl = this,
      defaultLocale = {
      'localeId' : 'en',
      'displayName' : 'English'
      };

    appCtrl.uiLocaleList = [ defaultLocale ];

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
                appCtrl.uiLocaleList, defaultLocale.localeId);
            if (!appCtrl.myInfo.locale) {
              appCtrl.myInfo.locale = defaultLocale;
            }
          },
          function(error) {
            MessageHandler.displayInfo('Error loading UI locale. ' +
              'Default to \'English\':' + error);
            appCtrl.myInfo.locale = defaultLocale;
          });
    }

    UserService.getMyInfo().then(
        function(myInfo) {
          appCtrl.myInfo = myInfo;
          appCtrl.myInfo.locale = defaultLocale;

          appCtrl.gravatarUrl = UrlService.gravatarUrl(
              appCtrl.myInfo.gravatarHash, 72);

          loadUILocale();
        }, function(error) {
          MessageHandler.displayInfo('Error loading my info: ' + error);
        });

    // On UI locale changes
    appCtrl.onChangeUILocale = function(locale) {
      appCtrl.myInfo.locale = locale;
      var uiLocaleId = appCtrl.myInfo.locale.localeId;
      if (!StringUtil.startsWith(uiLocaleId, defaultLocale.localeId, true)) {
        gettextCatalog.loadRemote(UrlService.translationURL(uiLocaleId))
            .then(
                function() {
                  gettextCatalog.setCurrentLanguage(uiLocaleId);
                },
                function(error) {
                  MessageHandler.displayInfo('Error changing UI locale. ' +
                    'Default to \'English\':' + error);
                  gettextCatalog.setCurrentLanguage(defaultLocale);
                  appCtrl.myInfo.locale = defaultLocale;
                });
      } else {
        gettextCatalog.setCurrentLanguage(defaultLocale.localeId);
      }
    };
  }

  angular.module('app').controller('AppCtrl', AppCtrl);

})();

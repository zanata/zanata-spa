
(function() {
  'use strict';

  /**
   * Handle server communication about active locales for the project-version.
   *
   * LocaleService.js
   * @ngInject
   */
  function LocaleService($resource, UrlService) {

    function getSupportedLocales(projectSlug, versionSlug) {

      var Locales = $resource(UrlService.LOCALE_LIST_URL, {},
        {
          query: {
            method: 'GET',
            params: {
              projectSlug: projectSlug,
              versionSlug: versionSlug
            },
            isArray: true
          }
        });

      return Locales.query().$promise;
    }

    return {
      getSupportedLocales: getSupportedLocales
    };
  }

  angular.module('app').factory('LocaleService', LocaleService);
})();

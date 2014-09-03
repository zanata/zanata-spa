
(function() {
  'use strict';

  /**
   * Handle locales related information.
   *
   * LocaleService.js
   * @ngInject
   */
  function LocaleService($resource, UrlService) {

    /**
     * Get project-version supported locales
     * @param projectSlug
     * @param versionSlug
     * @returns {$promise|*}
     */
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

    function getTranslationList() {
      var list = $resource('/translations/locales', {},
        {
          query: {
            method: 'GET',
          }
        });

      return list.query().$promise;
    }

    return {
      getSupportedLocales: getSupportedLocales,
      getTranslationList: getTranslationList
    };
  }

  angular.module('app').factory('LocaleService', LocaleService);
})();

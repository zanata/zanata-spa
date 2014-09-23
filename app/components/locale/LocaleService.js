(function() {
  'use strict';

  /**
   * Handle locales related information.
   *
   * LocaleService.js
   * @ngInject
   */
  function LocaleService(UrlService, StringUtil, $resource) {

    /**
     * Get project-version supported locales
     * @param projectSlug
     * @param versionSlug
     * @returns {$promise|*}
     */
    function getSupportedLocales(projectSlug, versionSlug) {

      var Locales = $resource(UrlService.LOCALE_LIST_URL, {}, {
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

    function getUILocaleList() {
      var list = $resource('/translations/locales', {}, {
        query: {
          method: 'GET'
        }
      });

      return list.query().$promise;
    }

    function getLocaleByLocaleId(locales, localeId) {
      if(locales) {
        for (var i = 0; i < locales.length; i++) {
          if (StringUtil.equals(locales[i].localeId, localeId, true)) {
            return locales[i];
          }
        }
      }
    }

    return {
      getSupportedLocales : getSupportedLocales,
      getUILocaleList     : getUILocaleList,
      getLocaleByLocaleId : getLocaleByLocaleId,
      DEFAULT_LOCALE: {
        'localeId' : 'en-us',
        'displayName' : 'English'
      }
    };
  }

  angular
    .module('app')
    .factory('LocaleService', LocaleService);
})();

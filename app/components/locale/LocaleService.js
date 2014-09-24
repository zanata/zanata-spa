(function() {
  'use strict';

  /**
   * Handle locales related information.
   *
   * LocaleService.js
   * @ngInject
   */
  function LocaleService(UrlService, StringUtil, $resource, _) {

    var locales = [];

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

    //Returns all locales supported in Zanata instance
    function getAllLocales() {
      var Locales = $resource(UrlService.ALL_LOCALE_URL, {}, {
        query: {
          method: 'GET',
          isArray: true
        }
      });
      return Locales.query().$promise.then(function(results) {
        locales = results;
      });
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
        return _.find(locales, function(locale) {
          return StringUtil.equals(locale.localeId, localeId, true);
        });
      }
    }

    function containsLocale (locales, localeId) {
      return _.any(locales, function(locale) {
        return StringUtil.equals(locale.localeId, localeId, true);
      });
    }

    function getDisplayName(localeId) {
      var locale = getLocaleByLocaleId(locales, localeId);
      if(locale) {
        return locale.displayName;
      }
      return localeId;
    }

    return {
      getSupportedLocales : getSupportedLocales,
      getUILocaleList     : getUILocaleList,
      getLocaleByLocaleId : getLocaleByLocaleId,
      getAllLocales : getAllLocales,
      containsLocale : containsLocale,
      getDisplayName : getDisplayName,
      DEFAULT_LOCALE: {
        'localeId' : 'en-US',
        'displayName' : 'English'
      }
    };
  }

  angular
    .module('app')
    .factory('LocaleService', LocaleService);
})();

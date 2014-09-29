(function() {
  'use strict';

  /**
   * Handle locales related information.
   *
   * LocaleService.js
   * @ngInject
   */
  function LocaleService(UrlService, StringUtil, FilterUtil, $resource, _) {

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
        locales = FilterUtil.cleanResourceList(results);
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

    function getname(localeId) {
      var locale = getLocaleByLocaleId(locales, localeId);
      if(locale) {
        return locale.name;
      }
      return localeId;
    }

    return {
      getSupportedLocales : getSupportedLocales,
      getUILocaleList     : getUILocaleList,
      getLocaleByLocaleId : getLocaleByLocaleId,
      getAllLocales : getAllLocales,
      containsLocale : containsLocale,
      getname : getname,
      DEFAULT_LOCALE: {
        'localeId' : 'en-US',
        'name' : 'English'
      }
    };
  }

  angular
    .module('app')
    .factory('LocaleService', LocaleService);
})();

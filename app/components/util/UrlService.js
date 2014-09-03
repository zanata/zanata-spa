(function() {
  'use strict';

  /**
   * Utility to handles URL related request.
   *
   * UrlService.js
   * @ngInject
   */
  function UrlService($location) {
    var gravatarBaseUrl = 'http://www.gravatar.com/avatar';

    var projectUrl = '/projects/p/:projectSlug';
    var versionUrl = '/projects/p/:projectSlug/iterations/i/:versionSlug';
    var statisticUrl = '/stats/proj/:projectSlug/iter/:versionSlug';

    function getLocalHost() {
      if (!window.location.origin) {
        return window.location.protocol + '//' + window.location.hostname +
          (window.location.port ? ':' + window.location.port : '');
      }
      return window.location.origin;
    }

    var translationsURL = getLocalHost() + '/translations';

    //TODO: get from document, configuration or URL
    var baseUrl = 'http://localhost:7878/zanata/rest';

    /**
     * Create a REST URL by appending all the given URL part arguments to the
     * base URL.
     *
     * No separators will be added or removed, so all parts should include
     * leading / and exclude trailing / to avoid problems.
     */
    function constructRestUrl() {
      return baseUrl + Array.prototype.join.call(arguments, '');
    }

    return {
      PROJECT_URL : constructRestUrl(projectUrl),
      LOCALE_LIST_URL : constructRestUrl(versionUrl, '/locales'),
      DOCUMENT_LIST_URL : constructRestUrl(versionUrl, '/r'),
      DOC_STATISTIC_URL : constructRestUrl(statisticUrl,
          '/doc/:docId/locale/:localeId'),

      /**
       * Get the value of a query string parameter.
       */
      readValue : function(key) {
        return $location.search()[key];
      },

      gravatarUrl : function(gravatarHash, size) {
        return gravatarBaseUrl + '/' + gravatarHash +
          '?d=mm&amp;r=g&amp;s=' + size;
      },

      translationURL : function(locale) {
        return translationsURL + '/' + locale + '.json';
      },

      translationListURL : function() {
        return translationsURL + '/locales';
      }
    };
  }

  angular.module('app').factory('UrlService', UrlService);
})();

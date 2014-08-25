(function() {
  'use strict';

  /**
   * UrlService.js
   * @ngInject
   */
  function UrlService($location) {
    var versionUrl = '/projects/p/:projectSlug/iterations/i/:versionSlug';

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
      LOCALE_LIST_URL: constructRestUrl(versionUrl, '/locales'),
      DOCUMENT_LIST_URL: constructRestUrl(versionUrl, '/r'),

      /**
       * Get the value of a query string parameter.
       */
      readValue: function(key) {
        return $location.search()[key];
      }

    };
  }

  angular.module('app').factory('UrlService', UrlService);
})();

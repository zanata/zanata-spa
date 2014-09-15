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
    //TODO: get from document, configuration or URL
    var baseUrl = 'http://localhost:7878/zanata/rest';

    // URLs over multiple lines are hard to read, allowing long lines here.
    // Warnings for jshint are turned off/on with -/+ before the warning code.
    // See: https://github.com/jshint/jshint/blob/2.1.4/src/shared/messages.js
    /* jshint -W101 */
    var urls = {
      project   : restUrl('/projects/p/:projectSlug'),
      locales   : restUrl('/projects/p/:projectSlug/iterations/i/:versionSlug/locales'),
      docs      : restUrl('/projects/p/:projectSlug/iterations/i/:versionSlug/r'),
      states    : restUrl('/projects/p/:projectSlug/iterations/i/:versionSlug/r/:docId/states/:localeId'),
      textFlows : restUrl('/source+trans/:localeId'),
      docStats  : restUrl('/stats/proj/:projectSlug/iter/:versionSlug/doc/:docId/locale/:localeId'),
      myInfo    : restUrl('/user'),
      userInfo  : restUrl('/user/:username')
    };
    /* jshint +W101 */


    var translationsURL = getLocalHost() + '/translations';


    return {
      PROJECT_URL            : urls.project,
      LOCALE_LIST_URL        : urls.locales,
      DOCUMENT_LIST_URL      : urls.docs,
      TRANSLATION_STATES_URL : urls.states,
      TEXT_FLOWS_URL         : urls.textFlows,
      DOC_STATISTIC_URL      : urls.docStats,
      MY_INFO_URL            : urls.myInfo,
      USER_INFO_URL          : urls.userInfo,

      /**
       * Get the value of a query string parameter.
       */
      readValue: function(key) {
        return $location.search()[key];
      },

      gravatarUrl: function(gravatarHash, size) {
        return gravatarBaseUrl + '/' + gravatarHash +
          '?d=mm&amp;r=g&amp;s=' + size;
      },

      translationURL: function(locale) {
        return translationsURL + '/' + locale + '.json';
      },

      translationListURL: function() {
        return translationsURL + '/locales';
      }
    };

    /**
     * Create a REST URL by appending all the given URL part arguments to the
     * base URL.
     *
     * No separators will be added or removed, so all parts should include
     * leading / and exclude trailing / to avoid problems.
     */
    function restUrl() {
      return baseUrl + Array.prototype.join.call(arguments, '');
    }

    function getLocalHost() {
      if (!window.location.origin) {
        return window.location.protocol + '//' + window.location.hostname +
          (window.location.port ? ':' + window.location.port : '');
      }
      return window.location.origin;
    }
  }

  angular
    .module('app')
    .factory('UrlService', UrlService);
})();

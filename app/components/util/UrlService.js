(function() {
  'use strict';

  /**
   * UrlService.js
   * @ngInject
   */
  function UrlService($location) {
    var urlService = {};

    //TODO: get from url
    urlService.contextPath = 'zanata';
    urlService.host = 'http://localhost:7878/';

    urlService.LOCALE_LIST_URL = urlService.constructRestUrl
    ('rest/projects/p/:projectSlug/iterations/i/:versionSlug/locales/l');

    urlService.DOCUMENT_LIST_URL = urlService.constructRestUrl
    ('rest/projects/p/:projectSlug/iterations/i/:versionSlug/r');

    urlService.baseUrl = location.protocol + '://' + location.host + '/' +
      (urlService.contextPath ? urlService.contextPath + '/' : '');

    urlService.constructRestUrl = function(url) {
      return urlService.host +
        (urlService.contextPath ? urlService.contextPath + '/' : '') +
        url;
    };

    urlService.readValue = function(key) {
      return $location.search()[key];
    };

    return urlService;
  }

  angular.module('app').factory('UrlService', UrlService);
})();

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

    urlService.baseUrl = location.protocol + '://' + location.host + '/' +
      (urlService.contextPath ? urlService.contextPath + '/' : '');

    urlService.constructRestUrl = function(url) {
      return 'http://localhost:7878/' +
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

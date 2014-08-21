'use strict';

(function() {

  /**
   * UrlService.js
   * @ngInject
   */
  function UrlService($location) {
    var urlService = {};

    urlService.contextPath = 'zanata';

    urlService.baseUrl = location.protocol + '://' + location.host + '/' +
      (urlService.contextPath ? urlService.contextPath + '/' : '');

    urlService.readValue = function(key) {
      return $location.search()[key];
    };

    return urlService;
  }

  angular.module('app').factory('UrlService', UrlService);
})();

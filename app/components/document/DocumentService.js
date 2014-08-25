(function () {
  'use strict';

  /**
   * DocumentService.js
   * @ngInject
   */
  function DocumentService($q, $filter, $timeout, $http, $resource,
                           UrlService) {
    var documentService = {};

    documentService.findAll = function (_projectSlug, _versionSlug) {
      var deferred = $q.defer(),
        documents;

      documents =
        $resource(UrlService.getDocumentListUrl(), {}, {
            query: {
              method: 'GET',
              params: {
                projectSlug: _projectSlug,
                versionSlug: _versionSlug
              },
              isArray: true
            }
          });

      deferred.resolve(documents.query());
      return deferred.promise;
    };

//    documentService.getStatistic =
//        function(_projectSlug, _versionSlug, _docId, _localeId) {
//      var deferred = $q.defer(), stats;
//
//      deferred.resolve(stats.query());
//      return deferred.promise;
//    };

    return documentService;
  }

  angular.module('app').factory('DocumentService', DocumentService);
})();

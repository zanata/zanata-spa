'use strict';

(function () {

  /**
   * DocumentService.js
   * @ngInject
   */
  function DocumentService($q, $filter, $timeout, $http, $resource,
                           UrlService) {
    var documentService = {},
    docListRestURL = UrlService.constructRestUrl(
      'rest/projects/p/:projectSlug/iterations/i/:versionSlug/r');

    documentService.findAll = function (_projectSlug, _versionSlug) {
      var deferred = $q.defer(),
        documents;

      documents =
        $resource(docListRestURL, {}, {
            query: {
              method: 'GET',
              // headers : {
              //   'Access-Control-Allow-Origin' : '*',
              //   'X-Auth-User' : UserService.username,
              //   'X-Auth-Token' : UserService.apiToken
              // },
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

    return documentService;
  }

  angular.module('app').factory('DocumentService', DocumentService);
})();

'use strict';

(function() {

  /**
   * DocumentService.js
   * @ngInject
   */
  function DocumentService($q, $filter, $timeout,
    $http, $resource) {
    var documentService = {};

    documentService.findAll = function(_projectSlug, _versionSlug) {
      var deferred = $q.defer(),
          documents;

      documents = $resource(
        '/' + (CONTEXT_PATH ? CONTEXT_PATH + '/': '') +
        'rest/projects/p/:projectSlug/iterations/i/:versionSlug/r',
        {}, {
          query : {
            method : 'GET',
            // headers : {
            //   'Access-Control-Allow-Origin' : '*',
            //   'X-Auth-User' : UserService.username,
            //   'X-Auth-Token' : UserService.apiToken
            // },
            params : {
              projectSlug : _projectSlug,
              versionSlug : _versionSlug
            },
            isArray : true
          }
        });

      deferred.resolve(documents.query());
      return deferred.promise;
    };

    return documentService;
  }

  angular.module('app').factory('DocumentService', DocumentService);
})();

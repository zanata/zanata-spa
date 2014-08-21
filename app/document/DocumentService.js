'use strict';

(function() {

  /**
   * DocumentService.js
   * @ngInject
   */
  function DocumentService($q, $filter, $timeout,
    $http, $resource) {
    var documentService = {};

    documentService.findAll = function() {
      var deferred = $q.defer(),
          documents;

      documents = $resource(
        'http://localhost:8080/zanata/rest/projects/p/' +
        ':projectSlug/iterations/i/:versionSlug/r',
        {}, {
          query : {
            method : 'GET',
            // headers : {
            //   'Access-Control-Allow-Origin' : '*',
            //   'X-Auth-User' : UserService.username,
            //   'X-Auth-Token' : UserService.apiToken
            // },
            params : {
              projectSlug : 'anaconda',
              versionSlug : '19.31.17'
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

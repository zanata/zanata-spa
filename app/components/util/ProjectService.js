(function() {
  'use strict';

  /**
   * ProjectService.js
   * @ngInject
   */

  function ProjectService(UrlService, $resource) {

    /**
     * Get project's information
     *
     * @param projectSlug
     * @returns {$promise|*|N.$promise}
     */
    function getProjectInfo(projectSlug) {
      var Locales = $resource(UrlService.PROJECT_URL, {}, {
        query : {
          method : 'GET',
          params : {
            projectSlug : projectSlug
          }
        }
      });

      return Locales.query().$promise;
    }

    return {
      getProjectInfo : getProjectInfo
    };
  }
  angular.module('app').factory('ProjectService', ProjectService);
})();

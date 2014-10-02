(function() {
  'use strict';

  /**
   * Handle communication with server on Project related information.
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
      var methods = {
          query: {
            method: 'GET',
            params: {
              projectSlug: projectSlug
            }
          }
        };

      var Locales = $resource(UrlService.PROJECT_URL, {}, methods);
      return Locales.query().$promise;
    }

    return {
      getProjectInfo: getProjectInfo
    };
  }
  angular
    .module('app')
    .factory('ProjectService', ProjectService);
})();

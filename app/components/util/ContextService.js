
(function() {
  'use strict';

  /**
   * ContextService.js
   * @ngInject
   */
  function ContextService() {
    return {
      //construct editor context
      loadEditorContext: function(projectSlug, versionSlug) {
        var editorContext = {
          projectSlug: projectSlug,
          versionSlug: versionSlug
        };
        return editorContext;
      }
    };
  }
  angular.module('app').factory('ContextService', ContextService);
})();

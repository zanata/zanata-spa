
(function() {
  'use strict';

  /**
   * Stores editor context information and permission/mode
   * (project, version, selected document, selected locale)
   *
   * ContextService.js
   * @ngInject
   */
  function ContextService() {
    return {
      //construct editor context
      loadEditorContext: function(projectSlug, versionSlug, document, locale) {
        var editorContext = {
          projectSlug: projectSlug,
          versionSlug: versionSlug,
          document: document,
          locale: locale
        };
        return editorContext;
      }
    };
  }
  angular.module('app').factory('ContextService', ContextService);
})();

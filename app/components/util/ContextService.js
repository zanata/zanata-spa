
(function() {
  'use strict';

  /**
   * ContextService.js
   * @ngInject
   */
  function ContextService() {
    return {
      //construct editor context
      loadEditorContext: function(projectSlug, versionSlug,
                                  docId, localeId) {
        var editorContext = {
          projectSlug: projectSlug,
          versionSlug: versionSlug,
          docId: docId,
          localeId: localeId
        };
        return editorContext;
      }
    };
  }
  angular.module('app').factory('ContextService', ContextService);
})();

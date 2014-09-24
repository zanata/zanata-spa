(function () {
  'use strict';

  /**
   * EditorService.js
   * //TODO: parse editorContext in functions
   * @ngInject
   */
  function EditorService() {
    var editorService = this;

    editorService.context = {};

    editorService.initContext =
      function (projectSlug, versionSlug, docId, srcLocale, localeId, mode) {
        editorService.context = {
          projectSlug: projectSlug,
          versionSlug: versionSlug,
          docId: docId,
          srcLocale: srcLocale,
          localeId: localeId,
          mode: mode // READ_WRITE, READ_ONLY, REVIEW
        };
        return editorService.context;
      };

    editorService.updateContext = function(projectSlug, versionSlug, docId, localeId) {
      if(editorService.context.projectSlug !== projectSlug) {
        editorService.context.projectSlug = projectSlug;
      }
      if(editorService.context.versionSlug !== versionSlug) {
        editorService.context.versionSlug = versionSlug;
      }
      if(editorService.context.docId !== docId) {
        editorService.context.docId = docId;
      }
      if(editorService.context.localeId !== localeId) {
        editorService.context.localeId = localeId;
      }
    };

    return editorService;
  }

  angular
    .module('app')
    .factory('EditorService', EditorService);

})();

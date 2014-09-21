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
      function (projectSlug, versionSlug, docId, srcLocale, locale, mode) {
        editorService.context = {
          projectSlug: projectSlug,
          versionSlug: versionSlug,
          docId: docId,
          srcLocale: srcLocale,
          locale: locale,
          mode: mode // READ_WRITE, READ_ONLY, REVIEW
        };
        return editorService.context;
      };

    return editorService;
  }

  angular
    .module('app')
    .factory('EditorService', EditorService);

})();

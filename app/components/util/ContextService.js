
(function() {
  'use strict';

  /**
   * ContextService.js
   * @ngInject
   */
  function ContextService(UrlService) {
    return {
      //construct editor context
      loadEditorContext: function() {
        var editorContext = {
          //http://localhost:8080/zanata/app/?projectSlug=projectName&versionSlug=versionName&docId=docId&localeId=en
          // projectSlug: UrlService.readValue('projectSlug'),
          // versionSlug: UrlService.readValue('versionSlug'),
          projectSlug: 'tiny-project',
          versionSlug: '1',
          projectName: 'Tiny project',
          docId: UrlService.readValue('docId'),
          docName: 'document name',
          localeId: UrlService.readValue('localeId'),
          locale: 'English'
        };
        console.debug(editorContext);
        return editorContext;
      }
    };
  }
  angular.module('app').factory('ContextService', ContextService);
})();

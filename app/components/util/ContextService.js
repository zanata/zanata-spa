
(function() {
  'use strict';

    /**
     * ContextService.js
     * @ngInject
     */
    function ContextService(UrlService) {
        var contextService = {};

        //construct editor context
        contextService.loadEditorContext = function() {
            var editorContext = {};
            //should be details through rest
            editorContext.projectSlug = UrlService.readValue('projectSlug');
            editorContext.projectName = 'Mortal combat';

            editorContext.versionSlug = UrlService.readValue('versionSlug');

            editorContext.docId = UrlService.readValue('docId');
            editorContext.docName = 'document name';

            editorContext.localeId = UrlService.readValue('localeId');
            editorContext.locale = 'English';

            //TODO: remove hard coded slug
            editorContext.projectSlug = 'tiny-project';
            editorContext.versionSlug = '1';

            console.debug(editorContext);

            return editorContext;
        } ;


        return contextService;
    }

    angular.module('app').factory('ContextService', ContextService);
})();

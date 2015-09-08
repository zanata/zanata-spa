/* global React, DocsDropdown */
(function() {
  'use strict';

  /**
   * @name docs-dropdown
   * @description directive for React-based document selector
   * @ngInject
   */
  function docsDropdown($rootScope, DropdownService) {
    return {
      restrict: 'E',
      required: ['editor'],
      link: function (scope, element) {
        scope.$watch('editor.context', render);
        scope.$watch('editor.documents', render);
        var cancelDropdownListener = $rootScope.$on('dropdown-changed', render);
        scope.$on('$destroy', cancelDropdownListener);

        // key for this dropdown, using an object since only identity matters
        var docsDropdownKey = {};

        // report open state to the dropdown service
        // this should change to be handled as part of a store update
        function toggleDropdown(button) {
          DropdownService.toggleDropdown(docsDropdownKey, button);
        }

        function render() {
          var editor = scope.editor;
          var ctx = editor.context;
          var docs = editor.documents || [];

          var props = {
            toggleDropdown: toggleDropdown,
            isOpen: DropdownService.getOpenDropdown() === docsDropdownKey,
            projectSlug: (ctx ? ctx.projectSlug : undefined),
            versionSlug: (ctx ? ctx.versionSlug : undefined),
            selectedDocId: (ctx ? ctx.docId : undefined),
            localeId: (ctx ? ctx.localeId : undefined),
            allDocs: docs.map(function (doc) {
              return doc.name;
            }),
            encodeDocId: scope.editor.encodeDocId
          };

          React.render(
            React.createElement(DocsDropdown, props),
            element[0]
          );
        }
      }
    };
  }

  angular
    .module('app')
    .directive('docsDropdown', docsDropdown);

})();

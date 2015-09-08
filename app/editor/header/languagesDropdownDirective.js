/* global React, LanguagesDropdown */
(function() {
  'use strict';

  /**
   * @name languages-dropdown
   * @description directive for React-based translation language selector
   * @ngInject
   */
  function languagesDropdown($rootScope, DropdownService) {
    return {
      restrict: 'E',
      required: ['editor'],
      link: function (scope, element) {
        scope.$watch('editor.context', render);
        scope.$watch('editor.locales', render);

        var cancelDropdownListener = $rootScope.$on('dropdown-changed', render);
        var cancelLocalesListener = $rootScope.$on('locales-updated', render);

        scope.$on('$destroy', cancelDropdownListener);
        scope.$on('$destroy', cancelLocalesListener);

        // key for this dropdown, using an object since only identity matters
        var localeDropdownKey = {};

        // report open state to the dropdown service
        // this should change to be handled as part of a store update
        function toggleDropdown(button) {
          DropdownService.toggleDropdown(localeDropdownKey, button);
        }

        function render() {
          var editor = scope.editor;
          var ctx = editor.context;
          var locales = editor.locales || [];

          var localeName = (ctx ?
            editor.getLocaleName(ctx.localeId) :
            undefined);

          var props = {
            locales: locales,
            projectSlug: (ctx ? ctx.projectSlug : undefined),
            versionSlug: (ctx ? ctx.versionSlug : undefined),
            encodedDocId: (ctx ? editor.encodeDocId(ctx.docId) : undefined),
            localeName: localeName,
            toggleDropdown: toggleDropdown,
            isOpen: DropdownService.getOpenDropdown() === localeDropdownKey
          };

          React.render(
            React.createElement(LanguagesDropdown, props),
            element[0]
          );
        }
      }
    };
  }

  angular
    .module('app')
    .directive('languagesDropdown', languagesDropdown);

})();

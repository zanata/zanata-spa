/* global React, UiLanguageDropdown */
(function() {
  'use strict';

  /**
   * @name ui-language-dropdown
   * @description directive for React-based user interface language selector
   * @ngInject
   */
  function uiLanguageDropdown($rootScope, DropdownService) {
    return {
      restrict: 'E',
      required: ['app', 'editor'],
      link: function (scope, element) {
        scope.$watch('app.myInfo.locale', render);
        scope.$watch('app.uiLocaleList', render);
        var cancelDropdownListener = $rootScope.$on('dropdown-changed', render);
        var cancelLocalesListener = $rootScope.$on('locales-updated', render);

        scope.$on('$destroy', cancelDropdownListener);
        scope.$on('$destroy', cancelLocalesListener);



        // key for this dropdown, using an object since only identity matters
        var uiLocaleDropdownKey = {};

        // report open state to the dropdown service
        // this should change to be handled as part of a store update
        function toggleDropdown(button) {
          DropdownService.toggleDropdown(uiLocaleDropdownKey, button);
        }

        function render() {
          var editor = scope.editor;
          var app = scope.app;
          var localeName = (app.myInfo ?
            editor.getLocaleName(app.myInfo.locale.localeId) :
            undefined);

          // FIXME uiLocales should have populated 'name' property
          var uiLocales = (app ? app.uiLocaleList : []);
          var locales = uiLocales.map(function (locale) {
            // this probably updates the original list, don't mind that
            // at the moment, since it will be replaced later
            locale.name = editor.getLocaleName(locale.localeId);
            return locale;
          });

          var props = {
            localeName: localeName,
            toggleDropdown: toggleDropdown,
            isOpen: DropdownService.getOpenDropdown() === uiLocaleDropdownKey,
            uiLocales: locales,
            changeUiLocale: app ? app.onChangeUILocale : function () {}
          };

          React.render(
            React.createElement(UiLanguageDropdown, props),
            element[0]
          );
        }
      }
    };
  }

  angular
    .module('app')
    .directive('uiLanguageDropdown', uiLanguageDropdown);

})();

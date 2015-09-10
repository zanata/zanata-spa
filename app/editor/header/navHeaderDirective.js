/* global React, NavHeader */
(function() {
  'use strict';

  /**
   * @name nav-header
   * @description directive for NavHeader react component
   * @ngInject
   */
  function navHeader($rootScope, DropdownService, UrlService, _) {
    return {
      restrict: 'E',
      required: ['app', 'editor'],
      link: function (scope, element) {

        // Trying to watch just editor does not detect a change to
        // editor.projectInfo, so instead I watch each of the required
        // properties separately.
        scope.$watch('app.myInfo.gravatarUrl', render);
        scope.$watch('app.myInfo.locale', render);
        scope.$watch('app.myInfo.name', render);
        scope.$watch('app.uiLocaleList', render);
        scope.$watch('editor.context', render);
        scope.$watch('editor.documents', render);
        scope.$watch('editor.locales', render);
        scope.$watch('editor.projectInfo', render);

        var cancelDropdownListener = $rootScope.$on('dropdown-changed', render);
        var cancelLocalesListener = $rootScope.$on('locales-updated', render);

        scope.$on('$destroy', cancelDropdownListener);
        scope.$on('$destroy', cancelLocalesListener);


        // used for object identity, so do not inline
        var docsDropdownKey = {};
        var localeDropdownKey = {};
        var uiLocaleDropdownKey = {};

        function render() {
          var app = scope.app;
          var editor = scope.editor;

          var props = {
            user: {},
            editorContext: editor.context,
            // TODO docs in as {id:..., encodedId:...} instead
            encodeDocId: editor.encodeDocId,
            openDropdown: DropdownService.getOpenDropdown(),
            docsDropdownKey: docsDropdownKey,
            localeDropdownKey: localeDropdownKey,
            uiLocaleDropdownKey: uiLocaleDropdownKey,
            allDocs: _.pluck(editor.documents || [], 'name'),
            toggleDropdown: function (key) {
              return function (button) {
                DropdownService.toggleDropdown(key, button);
              };
            },
            locales: editor.locales || []
          };

          if (editor.projectInfo) {
            props.projectName = editor.projectInfo.name;
          }

          if (editor.context) {
            props.versionPageUrl = UrlService.projectPage(
              props.projectSlug, props.versionSlug);
            props.encodedDocId = editor.encodeDocId(editor.context.docId);
            props.localeName = editor.getLocaleName(editor.context.localeId);
          }

          if (app) {
            props.uiLocales = (app.uiLocaleList || []).map(function (locale) {
              return {
                localeId: locale.localeId,
                name: editor.getLocaleName(locale.localeId)
              };
            });
            props.changeUiLocale = app.onChangeUILocale;
            props.user.dashboardUrl = app.dashboardPage();

            if (app.myInfo) {
              props.uiLocaleName =
                editor.getLocaleName(app.myInfo.locale.localeId);
              props.user.name = app.myInfo.name;
              props.user.gravatarUrl = app.myInfo.gravatarUrl;
            }
          }

          React.render(
            React.createElement(NavHeader, props),
            element[0]
          );
        }
      }
    };
  }

  angular
    .module('app')
    .directive('navHeader', navHeader);

})();




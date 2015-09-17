/* global require, React */
(function() {
  'use strict';

  var EditorHeader = require('EditorHeader');

  /**
   * @name editor-header
   * @description Header for navigation and control of the editor
   * @ngInject
   */
  function editorHeader($rootScope, DropdownService, gettextCatalog,
    SettingsService, UrlService, _) {
    return {
      restrict: 'E',
      required: ['app', 'editor'],
      link: function (scope, element) {
        scope.$watch('app.myInfo.gravatarUrl', render);
        scope.$watch('app.myInfo.locale', render);
        scope.$watch('app.myInfo.name', render);
        scope.$watch('app.uiLocaleList', render);
        scope.$watch('editor.context', render);
        scope.$watch('editor.documents', render);
        scope.$watch('editor.filter.status', render, true);
        scope.$watch('editor.locales', render);
        scope.$watch('editor.messageStatistic', render, true);
        scope.$watch('editor.pageCount()', render);
        scope.$watch('editor.pageNumber()', render);
        scope.$watch('editor.projectInfo', render);
        scope.$watch('editor.settings.hideMainNav', render);
        scope.$watch('editor.showSuggestions', render);

        SettingsService.subscribe(SettingsService.SETTING.SHOW_SUGGESTIONS,
          render);

        var cancelDropdownListener = $rootScope.$on('dropdown-changed', render);
        var cancelLocalesListener = $rootScope.$on('locales-updated', render);
        var cancelLanguageListener = $rootScope.$on('gettextLanguageChanged',
                                                    render);

        scope.$on('$destroy', cancelDropdownListener);
        scope.$on('$destroy', cancelLocalesListener);
        scope.$on('$destroy', cancelLanguageListener);

        // used for object identity, so do not inline
        var docsDropdownKey = {};
        var localeDropdownKey = {};
        var uiLocaleDropdownKey = {};



        render();



        /**
         * To create a plain callback that already has an associated key,
         * use onFilterChange.bind(undefined, key).
         */
        function onFilterChange (statusKey) {
          var status = scope.editor.filter.status;
          switch (statusKey) {
            case 'approved':
            case 'translated':
            case 'needsWork':
            case 'untranslated':
              scope.$apply(function () {
                // TODO use a dispatched event instead of this function
                status[statusKey] = !status[statusKey];
                // this checks that new values are compatible and corrects them
                scope.editor.updateFilter();
              });
              break;
            default:
              console.error('Invalid filter status key', statusKey);
              break;
          }
        }

        function render() {
          var app = scope.app;
          var editor = scope.editor;

          var suggestionsVisible = SettingsService.get(
            SettingsService.SETTING.SHOW_SUGGESTIONS);


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
            locales: editor.locales || [],

            filterStatus: editor.filter.status,
            counts: editor.messageStatistic,
            resetFilter: editor.resetFilter,
            onFilterChange: onFilterChange,
            pageNumber: editor.pageNumber(),
            pageCount: editor.pageCount(),
            firstPage: editor.firstPage,
            previousPage: editor.previousPage,
            nextPage: editor.nextPage,
            lastPage: editor.lastPage,
            toggleSuggestionPanel: editor.toggleSuggestionPanel,
            suggestionsVisible: suggestionsVisible,
            toggleKeyboardShortcutsModal: editor.toggleKeyboardShortcutsModal,
            mainNavHidden: editor.settings.hideMainNav,
            toggleMainNav: editor.toggleMainNav,
            gettextCatalog: gettextCatalog
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
            React.createElement(EditorHeader, props),
            element[0]
          );
        }
      }
    };
  }

  angular
    .module('app')
    .directive('editorHeader', editorHeader);
})();

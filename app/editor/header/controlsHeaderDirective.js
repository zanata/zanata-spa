/* global React, ControlsHeader */
(function() {
  'use strict';

  /**
   * @name controls-header
   * @description Header row with editor controls (filtering, paging, etc.)
   * @ngInject
   */
  function controlsHeader($rootScope, gettextCatalog, SettingsService) {
    return {
      restrict: 'E',
      required: ['editor'],
      link: function (scope, element) {
        scope.$watch('editor.filter.status', render, true);
        scope.$watch('editor.messageStatistic', render, true);
        scope.$watch('editor.pageNumber()', render);
        scope.$watch('editor.pageCount()', render);
        scope.$watch('editor.showSuggestions', render);
        scope.$watch('editor.settings.hideMainNav', render);

        SettingsService.subscribe(SettingsService.SETTING.SHOW_SUGGESTIONS,
          render);

        var cancelLanguageListener =
          $rootScope.$on('gettextLanguageChanged', render);
        scope.$on('$destroy', cancelLanguageListener);

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
          var editor = scope.editor;
          var suggestionsVisible = SettingsService.get(
            SettingsService.SETTING.SHOW_SUGGESTIONS);

          React.render(
            React.createElement(ControlsHeader, {
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
            }),
            element[0]
          );
        }
      }
    };
  }

  angular
    .module('app')
    .directive('controlsHeader', controlsHeader);
})();

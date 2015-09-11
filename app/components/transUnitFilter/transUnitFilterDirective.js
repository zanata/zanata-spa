/* global React, TransUnitFilter */
(function() {
  'use strict';

  /**
   * @name trans-unit-filter
   * @description panel with controls to filter the list of trans units
   * @ngInject
   */
  function transUnitFilter(gettextCatalog) {
    return {
      restrict: 'E',
      required: ['editor'],
      link: function (scope, element) {
        scope.$watch('editor.filter.status', render, true);
        scope.$watch('editor.messageStatistic', render, true);

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
          React.render(
            React.createElement(TransUnitFilter, {
              filterStatus: scope.editor.filter.status,
              counts: scope.editor.messageStatistic,
              resetFilter: scope.editor.resetFilter,
              onFilterChange: onFilterChange,
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
    .directive('transUnitFilter', transUnitFilter);

})();

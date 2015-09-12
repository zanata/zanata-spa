/* global React, Pager */
(function() {
  'use strict';

  /**
   * @name react-pager
   * @description paging buttons for trans unit list
   * @ngInject
   */
  function reactPager(gettextCatalog) {
    return {
      restrict: 'E',
      required: ['editor'],
      link: function (scope, element) {
        scope.$watch('editor.pageNumber()', render);
        scope.$watch('editor.pageCount()', render);

        function render() {
          var editor = scope.editor;

          React.render(
            React.createElement(Pager, {
              // FIXME all these callbacks probably have to live in
              // scope.$apply and may need to be bound to editor.
              // TODO replace callbacks with dispatcher events
              pageNumber: editor.pageNumber(),
              pageCount: editor.pageCount(),
              firstPage: editor.firstPage,
              previousPage: editor.previousPage,
              nextPage: editor.nextPage,
              lastPage: editor.lastPage,
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
    .directive('reactPager', reactPager);
})();

/* global React, TranslatingIndicator */
(function() {
  'use strict';

  /**
   * @name translating-indicator
   * @description display whether the user is translating
   * @ngInject
   */
  function translatingIndicator($rootScope, gettextCatalog) {
    return {
      restrict: 'E',
      required: ['app', 'editor'],
      link: function (scope, element) {
        var cancelLanguageListener =
          $rootScope.$on('gettextLanguageChanged', render);
        scope.$on('$destroy', cancelLanguageListener);

        render();

        function render() {
          React.render(
            React.createElement(TranslatingIndicator, {
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
    .directive('translatingIndicator', translatingIndicator);

})();




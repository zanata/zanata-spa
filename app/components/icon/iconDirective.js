(function() {
  'use strict';

  /**
   * @name icon
   * @description declarative svg icons
   * @ngInject
   */
  function icon($sce) {
    return {
      restrict: 'E',
      required: ['name'],
      scope: {
        name: '@',
        title: '@',
        size: '@'
      },
      // templateUrl: 'components/icon/icon.html',
      link: function(scope, element) {
        var svg = '',
            titleHtml = '';

        element.addClass('Icon');

        if (scope.title) {
          titleHtml = '<title>' + scope.title + '</title>';
        }

        // Stupid hack to make svg work
        svg = '' +
          '<svg class="Icon-item">' +
            '<use xlink:href="#Icon-' + scope.name + '" />' +
            titleHtml +
          '</svg>';
        element.html($sce.trustAsHtml(svg));
      }
    };
  }

  angular
    .module('app')
    .directive('icon', icon);

})();

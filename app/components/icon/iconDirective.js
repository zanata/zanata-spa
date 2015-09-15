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
          loader = '',
          titleHtml = '';

        element.addClass('Icon');

        if (scope.title) {
          titleHtml = '<title>' + scope.title + '</title>';
        }

        if (scope.name === 'loader') {
          // Can't seem to animate svg symbols
          element.addClass('Icon--loader');
          loader = '' +
            '<span class="Icon-item">' +
              '<span class="Icon--loader-dot"></span>' +
              '<span class="Icon--loader-dot"></span>' +
              '<span class="Icon--loader-dot"></span>' +
            '</span>';
          element.html($sce.trustAsHtml(loader));
        }
        else {
          // Stupid hack to make svg work
          svg = '' +
            '<svg class="Icon-item">' +
              '<use xlink:href="#Icon-' + scope.name + '" />' +
              titleHtml +
            '</svg>';
          element.html($sce.trustAsHtml(svg));
        }
      }
    };
  }

  angular
    .module('app')
    .directive('icon', icon);

})();

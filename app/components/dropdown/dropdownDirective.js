(function() {
  'use strict';

  /**
   * @name dropdown
   *
   * @description
   * Main dropdown container
   *
   */

  function dropdown() {
    return {
      restrict: 'EA',
      controller: 'DropdownCtrl',
      link: function(scope, element, attrs, dropdownCtrl) {
        dropdownCtrl.init(element);
      }
    };
  }

  function onCloseDropdown() {
    return {
      restrict: 'A',
      require: '?^dropdown',
      scope: {
        callback: '&onCloseDropdown'
      },
      link: function(scope, elem, attrs, dropdownCtrl) {
        dropdownCtrl.onCloseDropdown = scope.callback;
      }
    };
  }

  /**
   * @name dropdown-toggle
   *
   * @description
   * Main dropdown toggle
   *
   */

  function dropdownToggle() {
    return {
      restrict: 'EA',
      require: '?^dropdown',
      link: function(scope, element, attrs, dropdownCtrl) {
        if (!dropdownCtrl) {
          return;
        }

        dropdownCtrl.toggleElement = element;

        var toggleDropdown = function(event) {
          event.preventDefault();
          event.stopPropagation();

          if (!element.hasClass('disabled') && !attrs.disabled) {
            scope.$apply(function() {
              dropdownCtrl.toggle();
            });
          }
        };

        element.bind('click', toggleDropdown);

        // WAI-ARIA
        element.attr({
          'aria-haspopup': true,
          'aria-expanded': false
        });
        scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
          element.attr('aria-expanded', !!isOpen);
          if (dropdownCtrl.onCloseDropdown && !isOpen) {
            scope.$applyAsync(dropdownCtrl.onCloseDropdown);
          }
        });

        scope.$on('$destroy', function() {
          element.unbind('click', toggleDropdown);
        });
      }
    };
  }

  angular
    .module('app')
    .directive('dropdown', dropdown)
    .directive('onCloseDropdown', onCloseDropdown)
    .directive('dropdownToggle', dropdownToggle);

})();


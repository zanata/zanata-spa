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

          if (!element.hasClass('disabled') && !attrs.disabled) {
            scope.$apply(function() {
              dropdownCtrl.toggle();
            });
          }
        };

        element.bind('click', toggleDropdown);

        // WAI-ARIA
        element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
        scope.$watch(dropdownCtrl.isOpen, function( isOpen ) {
          element.attr('aria-expanded', !!isOpen);
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
    .directive('dropdownToggle', dropdownToggle);

})();

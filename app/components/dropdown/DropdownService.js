(function() {
  'use strict';

  /**
   * @name dropdownService
   *
   * @description
   * Handle dropdown events between directives
   *
   * @ngInject
   */

  function DropdownService($document, $rootScope) {
        // For Angular components, these will be phased out
    var openScope = null,
        // For React components, just an identifier, do not trigger events
        openDropdown = null,
        openDropdownButton = null,
        dropdownService = this;

    dropdownService.getOpenDropdown = function () {
      return openDropdown;
    };

    // this informs this service that a dropdown has opened, but will
    // also close the currently open dropdown if it is different from the
    // new one that is opening
    dropdownService.open = function(dropdownScope) {
      // ensure React dropdowns close
      if (openDropdown) {
        openDropdown = null;
        openDropdownButton = null;
        $rootScope.$broadcast('dropdown-changed');
      }

      if (!openScope) {
        $document.bind('click', closeDropdown);
        $document.bind('keydown', escapeKeyBind);
      }

      if (openScope && openScope !== dropdownScope) {
        openScope.isOpen = false;
      }

      openScope = dropdownScope;
    };

    // this just informs this service that a dropdown has closed
    dropdownService.close = function(dropdownScope) {
      if (openScope === dropdownScope) {
        openScope = null;
        $document.unbind('click', closeDropdown);
        $document.unbind('keydown', escapeKeyBind);
      }
    };

    // replacement for .open and .close
    // Call when a dropdown button is clicked to toggle it open or closed
    dropdownService.toggleDropdown = function (id, button) {
      // deal with legacy angular component that is bound
      // (this is not called from legacy code, so must always be closing those)
      if (openScope) {
        openScope.$apply(function() {
          openScope.isOpen = false;
        });
        openScope = null;
        openDropdown = id;
        openDropdownButton = button;
        $rootScope.$broadcast('dropdown-changed');
        return;
      }

      if (id === openDropdown) {
        // toggle the currently open dropdown to closed
        openDropdown = null;
        openDropdownButton = null;
        $rootScope.$broadcast('dropdown-changed');
        $document.unbind('click', closeDropdown);
        $document.unbind('keydown', escapeKeyBind);
      } else {
        if (openDropdown === null) {
          // nothing was bound, so bind events
          $document.bind('click', closeDropdown);
          $document.bind('keydown', escapeKeyBind);
        }
        openDropdown = id;
        openDropdownButton = button;
        $rootScope.$broadcast('dropdown-changed');
      }
    };

    function closeDropdown(evt) {
      if (!openScope && !openDropdown) {
        return;
      }
      if (openDropdown) {
        if (evt && openDropdownButton &&
            openDropdownButton.contains(evt.target)) {
          // this is the click that opened the dropdown, so don't close
          return;
        }
        openDropdown = null;
        openDropdownButton = null;
        $rootScope.$broadcast('dropdown-changed');
      }
      if (openScope) {
        var toggleElement = openScope.getToggleElement();
        if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
          return;
        }

        openScope.$apply(function() {
          openScope.isOpen = false;
        });
      }
    }

    function escapeKeyBind(evt) {
      if (evt.which === 27) {
        if (openScope) {
          openScope.focusToggleElement();
        }
        if (openDropdownButton) {
          openDropdownButton.focus();
        }
        closeDropdown();
      }
    }
  }

  angular
    .module('app')
    .service('DropdownService', DropdownService);

})();


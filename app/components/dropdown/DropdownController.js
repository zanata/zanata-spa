(function () {
  'use strict'

  /**
   * @name DropdownCtrl
   *
   * @description
   * Handle dropdown events between directives
   *
   * @ngInject
   */
  function DropdownCtrl ($scope, $attrs, $parse, dropdownConfig,
    DropdownService, $animate, $timeout) {
    var dropdownCtrl = this
      // create a child scope so we are not polluting original one
    var scope = $scope.$new()
    var openClass = dropdownConfig.openClass
    var getIsOpen
    var setIsOpen = angular.noop
    var toggleInvoker = $attrs.onToggle
      ? $parse($attrs.onToggle) : angular.noop

    this.init = function (element) {
      dropdownCtrl.$element = element

      if ($attrs.isOpen) {
        getIsOpen = $parse($attrs.isOpen)
        setIsOpen = getIsOpen.assign

        $scope.$watch(getIsOpen, function (value) {
          scope.isOpen = !!value
        })
      }
    }

    this.toggle = function (open) {
      scope.isOpen = arguments.length ? !!open : !scope.isOpen
      return scope.isOpen
    }

    // Allow other directives to watch status
    this.isOpen = function () {
      return scope.isOpen
    }

    scope.getToggleElement = function () {
      return dropdownCtrl.toggleElement
    }

    scope.focusToggleElement = function () {
      if (dropdownCtrl.toggleElement) {
        dropdownCtrl.toggleElement[0].focus()
      }
    }

    scope.$watch('isOpen', function (isOpen, wasOpen) {
      var action = isOpen ? 'addClass' : 'removeClass'
      $animate[action](dropdownCtrl.$element, openClass)

      if (isOpen) {
        // need to wrap it in a timeout
        // see http://stackoverflow.com/questions/12729122/
        // prevent-error-digest-already-in-progress-when-calling-scope-apply
        $timeout(function () {
          scope.focusToggleElement()
        })
        DropdownService.open(scope)
      } else {
        DropdownService.close(scope)
      }

      setIsOpen($scope, isOpen)
      if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
        toggleInvoker($scope, {
          open: !!isOpen
        })
      }
    })

    $scope.$on('$locationChangeSuccess', function () {
      scope.isOpen = false
    })

    $scope.$on('$destroy', function () {
      scope.$destroy()
    })

    $scope.$on('openDropdown', function () {
      scope.isOpen = true
    })

    $scope.$on('closeDropdown', function () {
      scope.isOpen = false
    })
  }

  angular
    .module('app')
    .controller('DropdownCtrl', DropdownCtrl)
})()

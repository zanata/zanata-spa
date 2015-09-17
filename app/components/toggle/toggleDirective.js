(function () {
  'use strict'

  /**
   * @name toggle-checkbox
   * @description Add an extra element to a checkbox to
   * so we can style it differently
   * @ngInject
   */
  function toggleCheckbox () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.after('<span class="Toggle-fakeCheckbox"></span>')
      }
    }
  }

  angular
    .module('app')
    .directive('toggleCheckbox', toggleCheckbox)
})()

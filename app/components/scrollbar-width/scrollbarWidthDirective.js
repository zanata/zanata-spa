(function () {
  'use strict'

  /**
   * @name scrollbarWidth
   *
   * @description
   * Scrollbar width container
   * Needed for the controller to reference all properties
   */
  function scrollbarWidth () {
    return {
      restrict: 'A',
      controller: 'ScrollbarWidthCtrl as scrollbarWidthCtrl',
      link: function (scope, element, attrs, scrollbarWidthCtrl) {
        scrollbarWidthCtrl.init(element)
      }
    }
  }

  /**
   * @name scrollbarWidthElement
   *
   * @description
   * The element to add the scrollbar width to
   */
  function scrollbarWidthElement () {
    return {
      restrict: 'A',
      require: '?^scrollbarWidth',
      link: function (scope, element, attrs, scrollbarWidthCtrl) {
        if (!scrollbarWidthCtrl) {
          return
        }
        // Use the attribute to decide which property to set
        element.css(attrs.scrollbarWidthElement, scrollbarWidthCtrl.width)
      }
    }
  }

  /**
   * @name scrollbarWidthContainer
   *
   * @description
   * Get the scrollbar container width
   */
  function scrollbarWidthContainer () {
    return {
      restrict: 'A',
      require: '?^scrollbarWidth',
      link: function (scope, element, attrs, scrollbarWidthCtrl) {
        if (!scrollbarWidthCtrl) {
          return
        }
        scrollbarWidthCtrl.container = element
      }
    }
  }

  /**
   * @name scrollbarWidthChild
   *
   * @description
   * Get the scrollbar child width
   */
  function scrollbarWidthChild () {
    return {
      restrict: 'A',
      require: '?^scrollbarWidth',
      link: function (scope, element, attrs, scrollbarWidthCtrl) {
        if (!scrollbarWidthCtrl) {
          return
        }
        scrollbarWidthCtrl.child = element
      }
    }
  }

  angular
    .module('app')
    .directive('scrollbarWidth', scrollbarWidth)
    .directive('scrollbarWidthElement', scrollbarWidthElement)
    .directive('scrollbarWidthContainer', scrollbarWidthContainer)
    .directive('scrollbarWidthChild', scrollbarWidthChild)
})()

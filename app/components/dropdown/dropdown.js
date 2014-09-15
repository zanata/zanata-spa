(function() {
  'use strict';

  /**
   * @name Dropdown
   *
   * @description
   * Custom module for dropdowns
   *
   */
  var dropdownConfig = {
    openClass: 'is-active'
  };

  angular
    .module('app')
    .constant('dropdownConfig', dropdownConfig);

})();

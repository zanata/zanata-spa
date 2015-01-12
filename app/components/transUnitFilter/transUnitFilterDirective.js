(function() {
  'use strict';

  /**
   * @name trans-unit
   * @description transUnit container
   * @ngInject
   */
  function transUnitFilter() {
    return {
      restrict: 'E',
      required: ['editor'],
      scope: {
        editor: '='
      },
      templateUrl: 'components/transUnitFilter/trans-unit-filter.html'
    };
  }

  angular
    .module('app')
    .directive('transUnitFilter', transUnitFilter);

})();

(function() {

'use strict';

  /**
   * @name logoLoader
   *
   * @description
   * Logo that is activated on global loading state
   *
   */

  function logoLoader() {
    return {
      restrict: 'EA',
      scope: {
        loading: '='
      },
      link: function($scope) {
        $scope.$watch('loading', function(newLoading) {
          if (newLoading) {
            $scope.classes = 'is-loading';
          }
          else {
            $scope.classes = '';
          }
        });
      },
      templateUrl: 'components/logo-loader/logo-loader.html'
    };
  }

  angular
    .module('app')
    .directive('logoLoader', logoLoader);

})();

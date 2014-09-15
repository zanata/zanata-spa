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
        loading: '=',
        inverted: '='
      },
      link: function($scope) {
        $scope.classes = '';
        $scope.$watch('loading', function(newLoading) {
          if (newLoading) {
            $scope.classes += ' is-loading';
          } else {
            $scope.classes = $scope.classes.replace('is-loading', '');
          }
        });
        $scope.$watch('inverted', function(newInverted) {
          if (newInverted) {
            $scope.classes += ' LogoLoader--inverted';
          } else {
            $scope.classes = $scope.classes.replace('LogoLoader--inverted', '');
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

/* global React, DashboardLink */
(function() {
  'use strict';

  /**
   * @name dashboard-link
   * @description directive for DashboardLink react component
   * @ngInject
   */
  function dashboardLink() {
    return {
      restrict: 'E',
      required: ['app'],
      link: function (scope, element) {

        scope.$watch('app.myInfo.name', render);
        scope.$watch('app.myInfo.gravatarUrl', render);
        // not watching dashboardUrl, it should not change so not worth
        // the complexity

        function render() {
          var myInfo = scope.app.myInfo;

          var props = {
            dashboardUrl: scope.app.dashboardPage(),
            name: myInfo ? myInfo.name : ''
          };

          if (myInfo) {
            props.gravatarUrl = myInfo.gravatarUrl;
          }

          React.render(
            React.createElement(DashboardLink, props),
            element[0]
          );
        }
      }
    };
  }

  angular
    .module('app')
    .directive('dashboardLink', dashboardLink);

})();




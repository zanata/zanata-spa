/* global React, ProgressBar */
(function() {
  'use strict';

  /**
   * @name message-stats-bar
   * @description react progress bar component
   * @ngInject
   */
  function messageStatsBar() {
    return {
      restrict: 'E',
      required: ['editor'],
      link: function (scope, element) {
        scope.$watch('editor.messageStatistic', render, true);

        function render() {
          React.render(
            React.createElement(ProgressBar, {
              size: 'small',
              stats: scope.editor.messageStatistic
            }),
            element[0]
          );
        }
      }
    };
  }

  angular
    .module('app')
    .directive('messageStatsBar', messageStatsBar);
})();

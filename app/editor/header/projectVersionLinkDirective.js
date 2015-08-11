/* global React, ProjectVersionLink */
(function() {
  'use strict';

  /**
   * @name project-version-link
   * @description directive for ProjectVersionLink react component
   * @ngInject
   */
  function projectVersionLink(UrlService) {
    return {
      restrict: 'E',
      required: ['editor'],
      link: function (scope, element) {
        // Trying to watch just editor does not detect a change to
        // editor.projectInfo, so instead I watch each of the required
        // properties separately.
        scope.$watch('editor.projectInfo', render);
        scope.$watch('editor.context', render);

        function render() {
          var editor = scope.editor;
          var projectName = editor.projectInfo ? editor.projectInfo.name
                                               : undefined;
          var versionName = editor.context ? editor.context.versionSlug
                                           : undefined;
          var versionPageUrl =
                editor.context ? UrlService.projectPage(
                                   editor.context.projectSlug,
                                   editor.context.versionSlug)
                               : undefined;
          React.render(
            React.createElement(ProjectVersionLink, {
              projectName: projectName,
              versionName: versionName,
              versionPageUrl: versionPageUrl
            }),
            element[0]
          );
        }

      }

    };
  }

  angular
    .module('app')
    .directive('projectVersionLink', projectVersionLink);

})();




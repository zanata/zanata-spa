(function () {
  'use strict'

  /**
   * EditorSuggestionsCtrl.js
   *
   * Controller just kept for resizer component. Remove when convenient.
   *
   * @ngInject
   */
  function EditorSuggestionsCtrl ($scope, SettingsService) {
    $scope.show = SettingsService.subscribe(
      SettingsService.SETTING.SHOW_SUGGESTIONS,
      function (show) {
        $scope.show = show
      })
    return this
  }

  angular
    .module('app')
    .controller('EditorSuggestionsCtrl', EditorSuggestionsCtrl)
})()

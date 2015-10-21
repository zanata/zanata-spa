module.exports = function () {
  'use strict'

  var React = require('react')
  var ToggleSwitch = require('ToggleSwitch')

  /**
   * @name suggestion-header
   * @description Header of the suggestion panel
   * @ngInject
   */
  function suggestionHeader (SettingsService) {
    return {
      restrict: 'E',
      required: [],
      link: function (scope, element) {
        var DIFF_SETTING =
          SettingsService.SETTING.SUGGESTIONS_SHOW_DIFFERENCE

        SettingsService.subscribe(DIFF_SETTING, render)

        render()

        function getInitialState () {
          var showDiff = SettingsService.get(DIFF_SETTING)
          return {
            showDiff: showDiff
          }
        }

        function handleShowDiffChange (event) {
          scope.$apply(function () {
            SettingsService.update(DIFF_SETTING, event.target.checked)
          })
        }

        function render () {
          // just re-generate state to keep it simple,
          // until redux takes over handling state
          var state = getInitialState()

          React.render(
            React.createElement(ToggleSwitch, {
              id: 'difference-toggle',
              isChecked: state.showDiff,
              onChange: handleShowDiffChange,
              label: 'Difference'
            }),
            element[0])
        }
      }
    }
  }

  angular
    .module('app')
    .directive('suggestionHeader', suggestionHeader)
}

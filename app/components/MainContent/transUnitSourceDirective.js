module.exports = function () {
  'use strict'

  var React = require('react')
  var intl = require('intl')
  var TransUnitSourcePanel = require('../TransUnitSourcePanel')

  /**
   * @name tu-source
   * @description panel to display the source part of a text unit
   * @ngInject
   */
  function transUnitSource ($rootScope, EventService) {
    return {
      restrict: 'E',
      required: [],
      link: function (scope, element) {
        var transUnitCtrl = scope.transUnitCtrl

        $rootScope.$on(EventService.EVENT.TRANSLATION_TEXT_MODIFIED,
          render)

        // this needs transUnitCtrl prefix because 'selected' is on the
        // controller object, not on the scope
        scope.$watch('transUnitCtrl.selected', function () {
          render()
        })

        function copyFromSource (sourceIndex) {
          // use the Angular phrase object, I think it needs that
          var phrase = transUnitCtrl.getPhrase()
          EventService.emitEvent(EventService.EVENT.COPY_FROM_SOURCE,
            {
              'phrase': phrase,
              'sourceIndex': sourceIndex
            })
        }

        // copied from mainContentDirective
        function cancelEdit () {
          var phrase = scope.phrase
          EventService.emitEvent(EventService.EVENT.CANCEL_EDIT, phrase)
        }

        function getInitialState () {
          return {
            phrase: scope.phrase,
            cancelEdit: cancelEdit,
            copyFromSource: copyFromSource,
            selected: transUnitCtrl.selected,
            sourceLocale: {
              id: scope.editorContext.srcLocale.localeId,
              name: scope.editorContext.srcLocale.name
            }
          }
        }

        function render () {
          // just re-generate state until redux controls this
          var state = getInitialState()
          React.render(React.createElement(TransUnitSourcePanel, state),
                       element[0])
        }

        render()
      }
    }
  }

  angular
    .module('app')
    .directive('transUnitSource', transUnitSource)
}

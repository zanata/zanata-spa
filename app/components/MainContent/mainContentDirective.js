module.exports = function () {
  'use strict'

  var React = require('react')
  var redux = require('redux')
  var createStore = redux.createStore
  var applyMiddleware = redux.applyMiddleware
  var thunk = require('redux-thunk')
  var Provider = require('react-redux').Provider
  var TransUnitLocaleHeading = require('../TransUnitLocaleHeading')
  var mainReducer = require('reducers/main-content')
  var intl = require('intl')

  // TODO combine all these to a single import statement when using es6 imports
  var actions = require('actions')
  var selectedLocaleChanged = actions.selectedLocaleChanged

  /**
   * @name main-content
   * @description panel to display the main text flow list for editing
   * @ngInject
   */
  function mainContent (LocaleService) {
    return {
      restrict: 'E',
      required: [],
      link: function (scope, element) {
        var createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
        var store = createStoreWithMiddleware(mainReducer, getInitialState())

        // NOTE scope.editorContext is defined as attribute
        //      editor-context in editor-content.html

        scope.$watch('editorContext.localeId', function (newValue) {
          store.dispatch(selectedLocaleChanged(newValue))
        })

        function getInitialState () {
          const localeId = scope.editorContext
            ? scope.editorContext.localeId
            : undefined

          return {
            localeId: localeId,
            localeName: LocaleService.getName(localeId)
          }
        }

        function render () {
          React.render(
            React.createElement(Provider, {
              store: store
            }, function () {
              // has to be wrapped in a function, according to redux docs
              return React.createElement(TransUnitLocaleHeading)
            }), element[0])
        }

        render()
      }
    }
  }

  angular
    .module('app')
    .directive('mainContent', mainContent)
}

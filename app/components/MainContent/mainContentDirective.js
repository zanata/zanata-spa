module.exports = function () {
  'use strict'

  var React = require('react')
  var redux = require('redux')
  var createStore = redux.createStore
  var applyMiddleware = redux.applyMiddleware
  var thunk = require('redux-thunk')
  var Provider = require('react-redux').Provider
  var TransUnitTranslationHeader = require('../TransUnitTranslationHeader')
  var mainReducer = require('reducers/main-content')
  var intl = require('intl')

  // TODO combine all these to a single import statement when using es6 imports
  var actions = require('actions')
  var selectedLocaleChanged = actions.selectedLocaleChanged
  var selectedTransUnitChanged = actions.selectedTransUnitChanged

  /**
   * @name main-content
   * @description panel to display the main text flow list for editing
   * @ngInject
   */
  function mainContent (EventService, LocaleService) {
    return {
      restrict: 'E',
      required: [],
      link: function (scope, element) {
        var createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
        var store = createStoreWithMiddleware(mainReducer, getInitialState())

        // NOTE scope.editorContext is defined as attribute
        //      editor-context in editor-content.html

        scope.$watch('editorContext.localeId', function (newValue) {
          store.dispatch(selectedLocaleChanged({
            id: newValue,
            name: LocaleService.getName(newValue)
          }))
        })

        // mirror phrase value from Angular
        // will not be needed when phrase is handled by redux
        scope.$watch('phrase', function (newValue) {
          // clone so that the dispatched value is not
          // one that will mutate. Angular will mutate
          // the phrase value.
          var newPhrase = _.clone(newValue)
          store.dispatch(selectedTransUnitChanged(newPhrase))
        }, true)

        function cancelEdit () {
          var phrase = scope.phrase
          EventService.emitEvent(EventService.EVENT.CANCEL_EDIT, phrase)
        }

        // This will have to change when React takes over the scope
        // can use phrase.id
        //    to look up the controller in TransUnitService
        //    then getPhrase() on the controller
        function undoEdit () {
          // look up the phrase since Angular code mutates it
          var phrase = scope.phrase
          EventService.emitEvent(EventService.EVENT.UNDO_EDIT, phrase)
        }

        function getInitialState () {
          const localeId = scope.editorContext
            ? scope.editorContext.localeId
            : undefined

          return {
            phrase: scope.phrase,
            cancelEdit: cancelEdit,
            undoEdit: undoEdit,
            translationLocale: {
              id: localeId,
              name: LocaleService.getName(localeId)
            }
          }
        }

        function render () {
          React.render(
            React.createElement(Provider, {
              store: store
            }, function () {
              // has to be wrapped in a function, according to redux docs
              return React.createElement(TransUnitTranslationHeader)
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

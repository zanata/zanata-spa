module.exports = function () {
  'use strict'

  var React = require('react')
  var redux = require('redux')
  var createStore = redux.createStore
  var applyMiddleware = redux.applyMiddleware
  var thunk = require('redux-thunk')
  var Provider = require('react-redux').Provider
  var reactRouter = require('react-router')
  var Router = reactRouter.Router
  var Route = reactRouter.Route
  var createHistory = require('history').createHistory
  var syncHistory = require('redux-simple-router').syncHistory
  var MainContent = require('../MainContent')
  var mainReducer = require('reducers/main-content')
  var intl = require('intl')

  // TODO combine all these to a single import statement when using es6 imports
  var actions = require('actions')
  var selectedLocaleChanged = actions.selectedLocaleChanged
  var selectedTransUnitChanged = actions.selectedTransUnitChanged
  var transUnitWithIdSelectionChanged = actions.transUnitWithIdSelectionChanged
  var translationTextInputChanged = actions.translationTextInputChanged
  var toggleDropdown = actions.toggleDropdown
  var phraseSuggestionCountUpdated = actions.phraseSuggestionCountUpdated
  var showSuggestionsChanged = actions.showSuggestionsChanged
  var setSuggestionSearchType = actions.setSuggestionSearchType
  var saveInitiated = actions.saveInitiated
  var saveCompleted = actions.saveCompleted
  var phrasesToDisplay = actions.phrasesToDisplay

  /**
   * @name main-content
   * @description panel to display the main text flow list for editing
   * @ngInject
   */
  function mainContent ($stateParams,
                        $rootScope,
                        EditorService,
                        EditorShortcuts,
                        EventService,
                        LocaleService,
                        PhraseService,
                        SettingsService,
                        TransStatusService) {
    return {
      restrict: 'E',
      required: [],
      link: function (scope, element) {
        var editorCtrl = scope.editorCtrl

        var history = createHistory()
        var reduxRouterMiddleware = syncHistory(history)
        var createStoreWithMiddleware =
          applyMiddleware(thunk, reduxRouterMiddleware)(createStore)
        var store = createStoreWithMiddleware(mainReducer, getInitialState())

        // sync store to history (from example readme)
        // I think this generates actions when the history changes
        // is the comment a typo?
        reduxRouterMiddleware.syncHistoryToStore(store)

        // NOTE scope.editorContext is defined as attribute
        //      editor-context in editor-content.html


        // FIXME this watch gives undefined values, but it looks
        //       like it should be giving real values.
        //       Just not allowing change of locale for now.
        // scope.$watch('$stateParams.localeId', function (newValue) {
        //   store.dispatch(selectedLocaleChanged({
        //     id: newValue,
        //     name: LocaleService.getName(newValue)
        //   }))
        // })

        // scope.$watch('EditorService.context.localeId', function (newValue) {
        //   console.log('it is happening', newValue)
        //   store.dispatch(selectedLocaleChanged({
        //     id: newValue,
        //     name: LocaleService.getName(newValue)
        //   }))
        // })

        // this needs transUnitCtrl prefix because 'selected' is on the
        // controller object, not on the scope
        // scope.$watch('transUnitCtrl.selected', function (newValue) {
        //   var selected = newValue
        //   store.dispatch(
        //     transUnitWithIdSelectionChanged(scope.phrase.id, selected))
        // })

        // mirror phrase value from Angular
        // will not be needed when phrase is handled by redux
        scope.$watch('phrase', function (newValue) {
          // clone so that the dispatched value is not
          // one that will mutate. Angular will mutate
          // the phrase value.
          var newPhrase = _.clone(newValue)
          store.dispatch(selectedTransUnitChanged(newPhrase))
        }, true)

        $rootScope.$on(EventService.EVENT.PHRASE_SUGGESTION_COUNT,
          function (event, data) {
            store.dispatch(phraseSuggestionCountUpdated(
              data.id, data.count))
          })

        SettingsService.subscribe(
          SettingsService.SETTING.SHOW_SUGGESTIONS,
          function (show) {
            store.dispatch(showSuggestionsChanged(show))
          })

        // FIXME copied from suggestionsPanelDirective,
        //       combine when stores combined
        $rootScope.$on(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
          function (event, showTextSearch) {
            var searchType = showTextSearch ? 'text' : 'phrase'
            store.dispatch(setSuggestionSearchType(searchType))
          })

        $rootScope.$on(EventService.EVENT.SAVE_INITIATED,
          function (event, data) {
            store.dispatch(saveInitiated(data.phrase.id, data.status.ID))
          })

        $rootScope.$on(EventService.EVENT.SAVE_COMPLETED,
          function (event, phrase) {
            store.dispatch(saveCompleted(phrase.id))
          })

        function cancelEdit (phrase) {
          // var phrase = scope.phrase
          // FIXME just handle this in redux
          EventService.emitEvent(EventService.EVENT.CANCEL_EDIT, phrase)
        }

        // This will have to change when React takes over the scope
        function undoEdit (phrase) {
          // look up the phrase since Angular code mutates it
          // var phrase = scope.phrase
          // FIXME just do this in redux
          EventService.emitEvent(EventService.EVENT.UNDO_EDIT, phrase)
        }

        function toggleSaveButtonDropdown (saveButtonKey) {
          // FIXME this will change to instead use a unique key per
          //       row and work with global dropdowns.
          store.dispatch(toggleDropdown(saveButtonKey))
        }

        function toggleSuggestionPanel () {
          // TODO handle all this with redux
          // scope.$apply(function () {
          //   transUnitCtrl.toggleSuggestionPanel()
          // })

          // FIXME implement this with redux
        }

        function textChanged (phraseId, index, event) {
          var text = event.target.value
          store.dispatch(translationTextInputChanged(phraseId, index, text))

          // // stateful phrase object in Angular, keep up-to-date until it
          // // can be removed.
          // scope.phrase.newTranslations[index] = text
          // // this may lead to double-update as the modification triggers
          // // a general change event.
          // EventService.emitEvent(
          //   EventService.EVENT.TRANSLATION_TEXT_MODIFIED, scope.phrase)
        }

        // event is just temporary to work ok with angular code
        function savePhraseWithStatus (phrase, status, event) {
          // close the dropdown (no dropdown should be open after this)
          store.dispatch(toggleDropdown(undefined))

          const statusInfo = TransStatusService.getStatusInfo(status)
          EditorShortcuts.saveTranslationCallBack(event, phrase, statusInfo)
        }

        // function selectPhrase (phrase) {
        //   transUnitCtrl.selectTransUnit(phrase)
        // }

        // TODO also need the cancel selection thing to set current
        //      phrase id to false, which will only do something if
        //      that was already the selected phrase id
        function selectPhrase (phraseId) {
          store.dispatch(transUnitWithIdSelectionChanged(phraseId, true))
        }

        function copyFromSource (phraseId, sourceIndex) {
          store.dispatch(actions.copyFromSource(phraseId, sourceIndex))
        }

        // this filter can maybe have an array
        // of status objects, but I will change it to
        // use an array of status id strings instead
        var filter = {}
        var startIndex = 0
        var COUNT_PER_PAGE = 50

        PhraseService.fetchAllPhrase(
          EditorService.context, filter, startIndex, COUNT_PER_PAGE)
          .then(function (phrases) {
            store.dispatch(phrasesToDisplay(phrases))
          })

        scope.$watch('EditorService.context', function () {

        })

        function getInitialState () {
          // const localeId = EditorService.context
          //   ? EditorService.context.localeId
          //   : undefined
          const localeId = $stateParams.localeId

          const sourceLocale = EditorService.context
            ? EditorService.context.srcLocale
            : undefined

          return {
            selectedPhraseId: undefined,
            copyFromSource: copyFromSource,
            openDropdown: undefined,
            toggleDropdown: toggleSaveButtonDropdown,
            savePhraseWithStatus: savePhraseWithStatus,
            selectPhrase: selectPhrase,
            // phrase: scope.phrase,

            // TODO may be able to use current phrases if any
            //      rather than wait for them to be replaced
            phrases: [],
            cancelEdit: cancelEdit,
            undoEdit: undoEdit,
            textChanged: textChanged,
            // probably does not need to update?
            isFirstPhrase: scope.firstPhrase,

            // this seems a reasonable default
            // isSaving: false,
            // savingStatusId: undefined,

            // { phraseId: 'statusString' }
            savingPhraseStatus: {},

            sourceLocale: {
              id: sourceLocale.localeId,
              name: sourceLocale.name
            },
            translationLocale: {
              id: $stateParams.localeId,
              name: LocaleService.getName(localeId)
            },
            suggestionCount: 0,
            showSuggestions: SettingsService.get(
              SettingsService.SETTING.SHOW_SUGGESTIONS),
            toggleSuggestionPanel: toggleSuggestionPanel,
            // TODO check this default value
            suggestionSearchType: 'phrase',

            // Creating default routing object in case needed since I am not
            // using combineReducers yet.
            routing: undefined
          }
        }

        function render () {
          React.render(
            React.createElement(
              Provider,
              { store: store},
              function () {
                // has to be wrapped in a function, according to redux docs
                return React.createElement(
                  Router,
                  { history: history },
                  React.createElement(
                    Route,
                    { path: '/', component: MainContent }
                  )
                )
              }
            ),
            element[0])
        }

        render()
      }
    }
  }

  angular
    .module('app')
    .directive('mainContent', mainContent)
}

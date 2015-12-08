module.exports = function () {
  'use strict'

  var React = require('react')
  var redux = require('redux')
  var createStore = redux.createStore
  var applyMiddleware = redux.applyMiddleware
  var thunk = require('redux-thunk')
  var Provider = require('react-redux').Provider
  var SuggestionsPanel = require('SuggestionsPanel')
  var mainReducer = require('reducers/suggestions')

  // TODO combine all these to a single import statement when using es6 imports
  var actions = require('actions')
  var diffSettingChanged = actions.diffSettingChanged
  var showSuggestionsChanged = actions.showSuggestionsChanged
  var transUnitSelectionChanged = actions.transUnitSelectionChanged
  var resetSuggestionsCopying = actions.resetSuggestionsCopying
  var suggestionStartedCopying = actions.suggestionStartedCopying
  var suggestionFinishedCopying = actions.suggestionFinishedCopying
  var phraseSuggestionsUpdated = actions.phraseSuggestionsUpdated
  var textSuggestionsUpdated = actions.textSuggestionsUpdated
  var suggestionSearchTextChange = actions.suggestionSearchTextChange
  var setSuggestionSearchType = actions.setSuggestionSearchType
  var uiLocaleChanged = actions.uiLocaleChanged

  /**
   * @name suggestions-panel
   * @description panel with search and display of suggestions
   * @ngInject
   */
  function suggestionsPanel ($rootScope, EventService, SettingsService,
    PhraseSuggestionsService, TextSuggestionsService) {
    return {
      restrict: 'E',
      required: ['app'],
      link: function (scope, element) {
        var app = scope.app
        var DIFF_SETTING = SettingsService.SETTING.SUGGESTIONS_SHOW_DIFFERENCE
        var SHOW_SETTING = SettingsService.SETTING.SHOW_SUGGESTIONS

        var createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
        var store = createStoreWithMiddleware(mainReducer, getInitialState())

        scope.$watch('app.myInfo.locale', function () {
          if (app && app.myInfo && app.myInfo.locale) {
            store.dispatch(uiLocaleChanged(app.myInfo.locale.localeId))
          }
        })

        SettingsService.subscribe(DIFF_SETTING, function (showDiff) {
          store.dispatch(diffSettingChanged(showDiff))
        })
        SettingsService.subscribe(SHOW_SETTING, function (show) {
          store.dispatch(showSuggestionsChanged(show))
        })

        $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT, function () {
          store.dispatch(transUnitSelectionChanged(true))

          // if no search was entered, automatically switch back to phrase search
          store.dispatch(function (dispatch, getState) {
            var hasTextSearch = getState().search.input.text.length > 0
            if (!hasTextSearch) {
              dispatch(setSuggestionSearchType('phrase'))
            }
          })
        })

        $rootScope.$on(EventService.EVENT.CANCEL_EDIT, function () {
          store.dispatch(transUnitSelectionChanged(false))
        })

        // User pressed a key shortcut or button to copy from a suggestion
        $rootScope.$on(EventService.EVENT.COPY_FROM_SUGGESTION_N,
          function (event, matchIndex) {
            store.dispatch(copyNthSuggestion(matchIndex))
          })

        /* decide whether to copy a visible suggestion or one from the
         * background phrase search
         */
        function copyNthSuggestion (index) {
          return function (dispatch, getState) {
            if (getState().showPanel) {
              dispatch(copyVisibleSuggestion(index))
            } else {
              copySuggestionFromBackgroundSearch(index)
            }

          }
        }

        function copySuggestionFromBackgroundSearch (index) {
          copySuggestion(PhraseSuggestionsService.getResults()[index])
        }

        /**
         * Copy a suggestion from whatever suggestions are currently visible.
         * Sets state to show 'copying' for 0.5 seconds.
         * If there is no suggestion matching the index, this will be a no-op
         * since it is expected for users to sometimes hit the key shortcut
         * to copy a suggestion when that suggestion does not exist.
         */
        function copyVisibleSuggestion (index) {
          return function (dispatch, getState) {
            var state = getState()
            var search = state.searchType === 'text'
              ? state.textSearch
              : state.phraseSearch
            var suggestions = search.suggestions

            if (suggestions && index < suggestions.length) {
              if (!suggestions[index].copying) {
                dispatch(suggestionStartedCopying(index))
                copySuggestion(suggestions[index])
                setTimeout(function () {
                  dispatch(suggestionFinishedCopying(index))
                }, 500)
              }
            }

          }
        }

        function copySuggestion (suggestion) {
          if (suggestion) {
            EventService.emitEvent(EventService.EVENT.COPY_FROM_SUGGESTION,
              { suggestion: suggestion })
          }
        }

        $rootScope.$on('PhraseSuggestionsService:updated', function () {
          store.dispatch(function (dispatch) {
            var updatedData = getPhraseSearchStateFromService()
            dispatch(phraseSuggestionsUpdated(updatedData))
          })
        })

        function getPhraseSearchStateFromService () {
          return getSearchStateFromService(PhraseSuggestionsService)
        }

        $rootScope.$on('TextSuggestionsService:updated', function () {
          store.dispatch(function (dispatch) {
            var updatedData = getTextSearchStateFromService()
            dispatch(textSuggestionsUpdated(updatedData))
          })
        })

        function getTextSearchStateFromService () {
          return getSearchStateFromService(TextSuggestionsService)
        }

        function getSearchStateFromService (service) {
          return {
            loading: service.isLoading(),
            searchStrings: service.getSearchStrings(),
            suggestions: suggestionsWithCopy(service.getResults())
          }
        }

        /* add copy callbacks to suggestions */
        function suggestionsWithCopy (suggestions) {
          return suggestions.map(function (suggestion, index) {
            return _.assign({}, suggestion, {
              copying: false,
              copySuggestion: function () {
                store.dispatch(copyVisibleSuggestion(index))
              }
            })
          })
        }

        function handleSearchTextChange (event) {
          store.dispatch(setSuggestionSearchType('text'))
          changeSearchText(event.target.value)
        }

        function changeSearchText (searchText) {
          store.dispatch(suggestionSearchTextChange(searchText))
          store.dispatch(function (dispatch, getState) {
            EventService.emitEvent(
              EventService.EVENT.REQUEST_TEXT_SUGGESTIONS,
              searchText)
          })
        }

        function handleShowDiffChange (event) {
          SettingsService.update(DIFF_SETTING, event.target.checked)
        }

        function handleToggleSearch () {
          store.dispatch(function (dispatch, getState) {
            var wasTypeText = getState().searchType === 'text'

            if (!wasTypeText) {
              changeSearchText('')
            }

            EventService.emitEvent(
              EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
              !wasTypeText)
          })
        }

        $rootScope.$on(EventService.EVENT.SUGGESTIONS_SEARCH_TOGGLE,
          function (event, showTextSearch) {
            var searchType = showTextSearch ? 'text' : 'phrase'
            store.dispatch(setSuggestionSearchType(searchType))
            if (!showTextSearch) {
              // clear text search when switching away from it
              store.dispatch(suggestionSearchTextChange(''))
            }
          })

        function handleClose () {
          SettingsService.update(SHOW_SETTING, false)
        }

        function handleClearSearch () {
          changeSearchText('')
        }

        function getInitialState () {
          var uiLocale = app.myInfo && app.myInfo.locale
            ? app.myInfo.locale.localeId
            : 'en-US'
          return {
            showPanel: SettingsService.get(SHOW_SETTING),
            searchType: 'phrase', // 'phrase' or 'text'
            phraseSearch: getPhraseSearchStateFromService(),
            textSearch: getTextSearchStateFromService(),

            closeSuggestions: handleClose,
            onDiffChange: handleShowDiffChange,
            showDiff: SettingsService.get(DIFF_SETTING),
            // TODO find a way to get accurate initial value
            transUnitSelected: false,
            search: {
              toggle: handleToggleSearch,
              clear: handleClearSearch,
              changeText: handleSearchTextChange,
              input: {
                text: '',
                focused: false
              }
            },

            locales: uiLocale,
            // FIXME move to top of component tree
            formats: {
              date: {
                medium: {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }
              }
            }
          }
        }

        function render () {
          // just re-generate state to keep it simple,
          // until redux takes over handling state
          var state = getInitialState()

          React.render(
            React.createElement(Provider, {
              store: store
            }, function () {
              // has to be wrapped in a function, according to redux docs
              return React.createElement(SuggestionsPanel)
            }), element[0])
        }

        render()
      }
    }
  }

  angular
    .module('app')
    .directive('suggestionsPanel', suggestionsPanel)
}

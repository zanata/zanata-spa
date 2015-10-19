(function () {
  'use strict'

  var React = require('react')
  var redux = require('redux')
  var createStore = redux.createStore
  var applyMiddleware = redux.applyMiddleware
  var thunk = require('redux-thunk')
  var Provider = require('react-redux').Provider
  var EditorHeader = require('EditorHeader')
  var mainReducer = require('reducers')

  // TODO combine all these when using es6 imports
  var actions = require('actions')
  var textflowCountsUpdated = actions.textflowCountsUpdated
  var gravatarUrlUpdated = actions.gravatarUrlUpdated
  var uiLocaleChanged = actions.uiLocaleChanged
  var userNameUpdated = actions.userNameUpdated
  var uiLocalesChanged = actions.uiLocalesChanged
  var projectSlugChanged = actions.projectSlugChanged
  var versionSlugChanged = actions.versionSlugChanged
  var selectedDocChanged = actions.selectedDocChanged
  var selectedLocaleChanged = actions.selectedLocaleChanged
  var projectVersionDocsChanged = actions.projectVersionDocsChanged
  var textflowFilterUpdated = actions.textflowFilterUpdated
  var projectVersionLocalesChanged = actions.projectVersionLocalesChanged
  var pageCountChanged = actions.pageCountChanged
  var pageNumberChanged = actions.pageNumberChanged
  var projectNameUpdated = actions.projectNameUpdated
  var panelVisibilityChanged = actions.panelVisibilityChanged
  var dropdownChanged = actions.dropdownChanged
  var gettextCatalogUpdated = actions.gettextCatalogUpdated

  /**
   * @name editor-header
   * @description Header for navigation and control of the editor
   * @ngInject
   */
  function editorHeader ($rootScope, DropdownService, gettextCatalog,
    SettingsService, UrlService, _) {
    return {
      restrict: 'E',
      required: ['app', 'editor'],
      link: function (scope, element) {
        var app = scope.app
        var editor = scope.editor

        var createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
        var store = createStoreWithMiddleware(mainReducer, getInitialState())

        scope.$watch('editor.messageStatistic', function () {
          store.dispatch(textflowCountsUpdated(
            _.mapValues(editor.messageStatistic,
              function (numberString) {
                return parseInt(numberString, 10)
              })))
        }, true)

        // watch Angular scopes and dispatch actions on the store
        scope.$watch('app.myInfo.gravatarUrl', function () {
          if (app && app.myInfo) {
            store.dispatch(gravatarUrlUpdated(
              app.myInfo.gravatarUrl))
          }
        })

        scope.$watch('app.myInfo.locale', function () {
          if (app && app.myInfo && app.myInfo.locale) {
            store.dispatch(uiLocaleChanged(app.myInfo.locale.localeId))
          }
        })

        scope.$watch('app.myInfo.name', function () {
          if (app && app.myInfo) {
            store.dispatch(userNameUpdated(app.myInfo.name))
          }
        })

        /* convert from structure used in angular to structure used in react */
        function prepareLocales (locales) {
          return _.chain(locales || [])
            .map(function (locale) {
              return {
                id: locale.localeId,
                name: editor.getLocaleName(locale.localeId)
              }
            })
            .indexBy('id')
            .value()
        }

        function getUiLocales () {
          if (app) {
            return prepareLocales(app.uiLocaleList)
          }
          return {}
        }

        scope.$watch('app.uiLocaleList', function () {
          store.dispatch(uiLocalesChanged(getUiLocales()))
        }, true)

        scope.$watch('editor.context.projectSlug', function () {
          if (editor && editor.context) {
            store.dispatch(projectSlugChanged(editor.context.projectSlug))
          }
        })

        scope.$watch('editor.context.versionSlug', function () {
          if (editor && editor.context) {
            store.dispatch(versionSlugChanged(editor.context.versionSlug))
          }
        })

        scope.$watch('editor.context.docId', function () {
          if (editor && editor.context) {
            store.dispatch(selectedDocChanged(editor.context.docId))
          }
        })
        scope.$watch('editor.context.localeId', function () {
          if (editor && editor.context) {
            store.dispatch(selectedLocaleChanged(editor.context.localeId))
          }
        })

        scope.$watch('editor.documents', function () {
          if (editor) {
            store.dispatch(projectVersionDocsChanged(
              _.pluck(editor.documents || [], 'name')))
          }
        })

        scope.$watch('editor.filter.status', function () {
          if (editor && editor.filter) {
            store.dispatch(textflowFilterUpdated(editor.filter.status))
          }
        }, true)

        function getLocales () {
          if (app) {
            return prepareLocales(editor.locales)
          }
          return {}
        }

        scope.$watch('editor.locales', function () {
          if (editor) {
            store.dispatch(projectVersionLocalesChanged(getLocales()))
          }
        })

        scope.$watch('editor.pageCount()', function () {
          store.dispatch(pageCountChanged(editor.pageCount()))
        })

        scope.$watch('editor.pageNumber()', function () {
          store.dispatch(pageNumberChanged(editor.pageNumber()))
        })

        scope.$watch('editor.projectInfo.name', function () {
          if (editor.projectInfo) {
            store.dispatch(projectNameUpdated(editor.projectInfo.name))
          }
        })

        scope.$watch('editor.settings.hideMainNav', function () {
          store.dispatch(
            panelVisibilityChanged('navHeader', !editor.settings.hideMainNav))
        })

        SettingsService.subscribe(SettingsService.SETTING.SHOW_SUGGESTIONS,
          function (show) {
            store.dispatch(panelVisibilityChanged('suggestions', show))
          })

        var cancelDropdownListener = $rootScope.$on('dropdown-changed',
          function () {
            store.dispatch(dropdownChanged(DropdownService.getOpenDropdown()))
          })

        var cancelLocalesListener = $rootScope.$on('locales-updated',
          function () {
            store.dispatch(projectVersionLocalesChanged(getLocales()))
          })

        var cancelLanguageListener = $rootScope.$on('gettextLanguageChanged',
          function () {
            store.dispatch(uiLocaleChanged(app.myInfo.locale.localeId))

            // gettext catalog must be updated to the new one with the new
            // language (returns strings for wrong locale otherwise)
            store.dispatch(gettextCatalogUpdated(gettextCatalog))
          })

        scope.$on('$destroy', cancelDropdownListener)
        scope.$on('$destroy', cancelLocalesListener)
        scope.$on('$destroy', cancelLanguageListener)

        render()

        /**
         * To create a plain callback that already has an associated key,
         * use onFilterChange.bind(undefined, key).
         */
        function onFilterChange (statusKey) {
          var status = scope.editor.filter.status
          switch (statusKey) {
            case 'approved':
            case 'translated':
            case 'needsWork':
            case 'untranslated':
              scope.$apply(function () {
                // TODO use a dispatched event instead of this function
                status[statusKey] = !status[statusKey]
                // this checks that new values are compatible and corrects them
                scope.editor.updateFilter()
              })
              break
            default:
              console.error('Invalid filter status key', statusKey)
              break
          }
        }

        function getInitialState () {
          var docsDropdownKey = 'DOCS_DROPDOWN'
          var localeDropdownKey = 'LOCALE_DROPDOWN'
          var uiLocaleDropdownKey = 'UI_LOCALE_DROPDOWN'

          var app = scope.app
          var editor = scope.editor
          var suggestionsVisible = SettingsService.get(
            SettingsService.SETTING.SHOW_SUGGESTIONS)
          var props = {
            actions: {
              // changeUiLocale: defined below,
              toggleDropdown: function (key) {
                return function (button) {
                  DropdownService.toggleDropdown(key, button)
                }
              },
              resetFilter: editor.resetFilter,
              onFilterChange: onFilterChange,
              firstPage: editor.firstPage,
              previousPage: editor.previousPage,
              nextPage: editor.nextPage,
              lastPage: editor.lastPage,
              toggleSuggestionPanel: editor.toggleSuggestionPanel,
              toggleKeyboardShortcutsModal: editor.toggleKeyboardShortcutsModal,
              toggleMainNav: editor.toggleMainNav
            },
            data: {
              user: {},
              context: {
                projectVersion: {
                  project: {
                    slug: editor.context.projectSlug
                    // name: defined below
                  },
                  version: editor.context.versionSlug,
                  // url defined below
                  docs: _.pluck(editor.documents || [], 'name'),
                  locales: getLocales()
                },
                selectedDoc: {
                  // id: defined below
                  counts: _.mapValues(editor.messageStatistic,
                    function (numberString) {
                      return parseInt(numberString, 10)
                    })
                }
                // selectedLocale: defined below
              }
            },
            ui: {
              panels: {
                suggestions: {
                  visible: suggestionsVisible
                },
                navHeader: {
                  visible: !editor.settings.hideMainNav
                }
              },
              // selectedUiLocale: set below
              uiLocales: getUiLocales(),
              dropdowns: {
                current: DropdownService.getOpenDropdown(),
                docsKey: docsDropdownKey,
                localeKey: localeDropdownKey,
                uiLocaleKey: uiLocaleDropdownKey
              },
              textFlowDisplay: {
                filter: editor.filter.status,
                pageNumber: editor.pageNumber(),
                pageCount: editor.pageCount()
              },
              gettextCatalog: gettextCatalog
            }
          }

          var projectVersion = props.data.context.projectVersion

          if (editor.projectInfo) {
            projectVersion.project.name = editor.projectInfo.name
          }

          if (editor.context) {
            projectVersion.url = UrlService.projectPage(
              projectVersion.project.slug, projectVersion.version)
            props.data.context.selectedDoc.id = editor.context.docId
            props.data.context.selectedLocale = editor.context.localeId
          }

          if (app) {
            props.actions.changeUiLocale = app.onChangeUILocale
            props.data.user.dashboardUrl = app.dashboardPage()

            if (app.myInfo) {
              props.ui.selectedUiLocale = app.myInfo.locale.localeId
              props.data.user.name = app.myInfo.name
              props.data.user.gravatarUrl = app.myInfo.gravatarUrl
            }
          }

          return props
        }

        function render () {
          React.render(
            React.createElement(Provider, {
              store: store
            }, function () {
              // has to be wrapped in a function, according to redux docs
              return React.createElement(EditorHeader)
            }),
            element[0]
          )
        }
      }
    }
  }

  angular
    .module('app')
    .directive('editorHeader', editorHeader)
})()

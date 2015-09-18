(function () {
  'use strict'

  var EditorHeader = require('EditorHeader')

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
        scope.$watch('app.myInfo.gravatarUrl', render)
        scope.$watch('app.myInfo.locale', render)
        scope.$watch('app.myInfo.name', render)
        scope.$watch('app.uiLocaleList', render)
        scope.$watch('editor.context', render)
        scope.$watch('editor.documents', render)
        scope.$watch('editor.filter.status', render, true)
        scope.$watch('editor.locales', render)
        scope.$watch('editor.messageStatistic', render, true)
        scope.$watch('editor.pageCount()', render)
        scope.$watch('editor.pageNumber()', render)
        scope.$watch('editor.projectInfo', render)
        scope.$watch('editor.settings.hideMainNav', render)
        scope.$watch('editor.showSuggestions', render)

        SettingsService.subscribe(SettingsService.SETTING.SHOW_SUGGESTIONS,
          render)

        var cancelDropdownListener = $rootScope.$on('dropdown-changed', render)
        var cancelLocalesListener = $rootScope.$on('locales-updated', render)
        var cancelLanguageListener = $rootScope.$on('gettextLanguageChanged',
                                                    render)

        scope.$on('$destroy', cancelDropdownListener)
        scope.$on('$destroy', cancelLocalesListener)
        scope.$on('$destroy', cancelLanguageListener)

        // used for object identity, so do not inline
        var docsDropdownKey = {}
        var localeDropdownKey = {}
        var uiLocaleDropdownKey = {}

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

        function render () {
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
                  locales: _.chain(editor.locales || [])
                    .map(function (locale) {
                      return {
                        id: locale.localeId,
                        name: locale.name
                      }
                    })
                    .indexBy('id')
                    .value()
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
              // uiLocales: set below
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
              }
            },
            gettextCatalog: gettextCatalog
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
            props.ui.uiLocales = _.chain(app.uiLocaleList || [])
              .map(function (locale) {
                return {
                  id: locale.localeId,
                  name: editor.getLocaleName(locale.localeId)
                }
              })
              .indexBy('id')
              .value()
            props.actions.changeUiLocale = app.onChangeUILocale
            props.data.user.dashboardUrl = app.dashboardPage()

            if (app.myInfo) {
              props.ui.selectedUiLocale = app.myInfo.locale.localeId
              props.data.user.name = app.myInfo.name
              props.data.user.gravatarUrl = app.myInfo.gravatarUrl
            }
          }

          React.render(
            React.createElement(EditorHeader, props),
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

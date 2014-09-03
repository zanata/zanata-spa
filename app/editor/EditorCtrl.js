(function() {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl(UserService, PhraseService, DocumentService,
      LocaleService, UrlService, StatisticUtil, ProjectService, $stateParams,
      gettextCatalog, StringUtil, $location, MessageHandler) {
    var limit = 50, editorCtrl = this, defaultLocale = {
      'localeId' : 'en',
      'displayName' : 'English'
    };

    editorCtrl.languages = [ defaultLocale ];

    //TODO: perform login (cross domain)
    //TODO: need user information when login
    //TODO: Unit test

    //Working URL: http://localhost:8000/#/tiny-project/1 or
    // http://localhost:8000/#/tiny-project/1?docId=hello.txt&localeId=fr

    //Get document by docId from list
    function getDocById(documents, docId) {
      for ( var i = 0; i < documents.length; i++) {
        if (StringUtil.equals(documents[i].name, docId, true)) {
          return documents[i];
        }
      }
    }

    //Get locale by localeId from list
    function getLocaleByLocaleId(locales, localeId) {
      for ( var i = 0; i < locales.length; i++) {
        if (StringUtil.equals(locales[i].localeId, localeId, true)) {
          return locales[i];
        }
      }
    }

    editorCtrl.context = UserService.editorContext($stateParams.projectSlug,
        $stateParams.versionSlug, '', '', 'READ_WRITE');

    editorCtrl.userInfo = UserService.getUserInfo();
    editorCtrl.userInfo.locale = defaultLocale;

    editorCtrl.gravatarUrl = UrlService.gravatarUrl(
        editorCtrl.userInfo.gravatarHash, 72);

    LocaleService.getTranslationList().then(
        function(translationList) {
          for ( var i in translationList.locales) {
            var language = {
              'localeId' : translationList.locales[i],
              'displayName' : ''
            };
            editorCtrl.languages.push(language);
          }
          editorCtrl.userInfo.locale = getLocaleByLocaleId(
              editorCtrl.languages, defaultLocale.localeId);
          if (!editorCtrl.userInfo.locale) {
            editorCtrl.userInfo.locale = defaultLocale;
          }
        },
        function(error) {
          MessageHandler.displayInfo('Error loading UI locale. ' +
            'Default to \'English\':' + error);

          editorCtrl.userInfo.locale = defaultLocale;
        });

    ProjectService.getProjectInfo($stateParams.projectSlug).then(
        function(projectInfo) {
          editorCtrl.projectInfo = projectInfo;
        },
        function(error) {
          MessageHandler.displayError('Error getting project ' +
            'information:' + error);
        });

    DocumentService.findAll(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug).then(
        function(documents) {
          editorCtrl.documents = documents;

          if (!editorCtrl.documents || editorCtrl.documents.length <= 0) {
            //redirect if no documents in version
            MessageHandler.displayError('No documents in ' +
              editorCtrl.context.projectSlug + ' : ' +
              editorCtrl.context.versionSlug);
          } else {
            //if docId is not defined in url, set to first from list
            var selectedDocId = UrlService.readValue('docId');
            //            var selectedDocId = $stateParams.docId;
            if (!selectedDocId) {
              editorCtrl.context.document = editorCtrl.documents[0];
            } else {
              editorCtrl.context.document = getDocById(editorCtrl.documents,
                  selectedDocId);
              if (!editorCtrl.context.document) {
                editorCtrl.context.document = editorCtrl.documents[0];
              }
            }
          }
        }, function(error) {
          MessageHandler.displayError('Error getting document list: ' + error);
        });

    LocaleService.getSupportedLocales(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug).then(
        function(locales) {
          editorCtrl.locales = locales;

          if (!editorCtrl.locales || editorCtrl.locales.length <= 0) {
            //redirect if no supported locale in version
            MessageHandler.displayError('No supported locales in ' +
              editorCtrl.context.projectSlug + ' : ' +
              editorCtrl.context.versionSlug);
          } else {
            //if localeId is not defined in url, set to first from list
            var selectedLocaleId = UrlService.readValue('localeId');
            //var selectedDocId = $stateParams.localeId;
            if (!selectedLocaleId) {
              editorCtrl.context.locale = editorCtrl.locales[0];
            } else {
              editorCtrl.context.locale = getLocaleByLocaleId(
                  editorCtrl.locales, selectedLocaleId);
              if (!editorCtrl.context.locale) {
                editorCtrl.context.locale = editorCtrl.locales[0];
              }
            }
          }
        }, function(error) {
          MessageHandler.displayError('Error getting locale list: ' + error);
        });

    // On selected document or locale changed
    editorCtrl.onLocaleOrDocumentChanged = function() {
      if (editorCtrl.context.document && editorCtrl.context.locale) {
        var context = editorCtrl.context;

        //update url
        $location.search('docId', context.document.name);
        $location.search('localeId', context.locale.localeId);

        editorCtrl.loadStatistic(context.projectSlug, context.versionSlug,
            context.document.name, context.locale.localeId);

        editorCtrl.loadPhases(context.projectSlug, context.versionSlug,
            context.document.name, context.locale.localeId);
      }
    };

    // On UI locale changes
    editorCtrl.onChangeUILocale = function() {
      var uiLocaleId = editorCtrl.userInfo.locale.localeId;
      if (!StringUtil.startsWith(uiLocaleId, defaultLocale.localeId, true)) {
        gettextCatalog.loadRemote(UrlService.translationURL(uiLocaleId)).then(
            function() {
              gettextCatalog.setCurrentLanguage(uiLocaleId);
            },
            function(error) {
              MessageHandler.displayInfo('Error changing UI locale. ' +
                'Default to \'English\':' + error);
              gettextCatalog.setCurrentLanguage(defaultLocale);
              editorCtrl.userInfo.locale = defaultLocale;
            });
      } else {
        gettextCatalog.setCurrentLanguage(defaultLocale.localeId);
      }
    };

    /**
     * Load document statistics (word and message)
     * see EditorCtrl.onLocaleOrDocumentChanged
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    editorCtrl.loadStatistic = function(projectSlug, versionSlug, docId,
        localeId) {
      DocumentService.getStatistics(projectSlug, versionSlug, docId, localeId)
          .then(
              function(statistics) {
                editorCtrl.wordStatistic = StatisticUtil
                    .getWordStatistic(statistics);
                editorCtrl.msgStatistic = StatisticUtil
                    .getMsgStatistic(statistics);
                editorCtrl.statisticStyles = StatisticUtil
                    .getStyles(editorCtrl.wordStatistic);
              },
              function(error) {
                MessageHandler
                    .displayError('Error loading statistic: ' + error);
              });
    };

    /**
     * Load transUnit
     * see EditorCtrl.onLocaleOrDocumentChanged
     *
     * @param projectSlug
     * @param versionSlug
     * @param docId
     * @param localeId
     */
    editorCtrl.loadPhases = function(projectSlug, versionSlug,
                                     docId, localeId) {
      PhraseService.findAll(limit, projectSlug, versionSlug, docId, localeId)
          .then(function(phrases) {
            editorCtrl.phrases = phrases;
          });
    };

    this.settings = UserService.settings.editor;
  }

  angular.module('app').controller('EditorCtrl', EditorCtrl);
})();

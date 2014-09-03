(function() {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl(UserService, PhraseService, DocumentService,
      LocaleService, UrlService, StatisticUtil, ProjectService, $stateParams,
      gettextCatalog, StringUtil) {
    var limit = 50, editorCtrl = this,
      defaultLocale = {
        'localeId' : 'en',
        'displayName' : 'English'
      };

    editorCtrl.languages = [defaultLocale];

    //TODO: perform login (cross domain)
    //TODO: need user information when login
    //TODO: Unit test

    //Working URL: http://localhost:8000/#/tiny-project/1 or
    // http://localhost:8000/#/tiny-project/1/hello/fr

    //Get document by docId from list
    function getDocById(documents, docId) {
      for ( var i in documents) {
        if (StringUtil.equals(documents[i].name, docId, true)) {
          return documents[i];
        }
      }
    }

    //Get locale by localeId from list
    function getLocaleByLocaleId(locales, localeId) {
      for ( var i in locales) {
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


    LocaleService.getTranslationList().then(function(translationList) {
      for(var i in translationList.locales) {
        var language = {
          'localeId' :translationList.locales[i],
          'displayName' : ''
        };
        editorCtrl.languages.push(language);
      }
      editorCtrl.userInfo.locale = getLocaleByLocaleId(editorCtrl.languages,
        defaultLocale.localeId);
    }, function(error) {
      console.error('Error loading translations:' + error);
    });

    ProjectService.getProjectInfo($stateParams.projectSlug).then(
        function(projectInfo) {
          editorCtrl.projectInfo = projectInfo;
        }, function(error) {
          console.error('Error getting project information:' + error);
        });

    DocumentService.findAll(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug).then(
        function(documents) {
          editorCtrl.documents = documents;

          //if docId is not defined in url, set to first from list
          if (!$stateParams.docId && editorCtrl.documents.length > 0) {
            editorCtrl.context.document = editorCtrl.documents[0];
          } else {
            editorCtrl.context.document = getDocById(documents,
                $stateParams.docId);
          }
        }, function(error) {
          console.error('Error getting document list:' + error);
        });

    LocaleService.getSupportedLocales(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug).then(
        function(locales) {
          editorCtrl.locales = locales;

          //if localeId is not defined in url, set to first from list
          if (!$stateParams.localeId && editorCtrl.locales.length > 0) {
            editorCtrl.context.locale = editorCtrl.locales[0];
          } else {
            editorCtrl.context.locale = getLocaleByLocaleId(locales,
                $stateParams.localeId);
          }
        }, function(error) {
          console.error('Error getting locale list:' + error);
        });

    // On selected document or locale changed
    editorCtrl.onLocaleOrDocumentChanged = function() {
      if (editorCtrl.context.document && editorCtrl.context.locale) {
        var context = editorCtrl.context;

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
            }, function(error) {
              console.error('Error loading locale:' + error);
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
              }, function(error) {
                console.error('Error getting statistic:' + error);
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

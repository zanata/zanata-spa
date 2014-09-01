(function() {
  'use strict';

  /**
   * EditorCtrl.js
   * @ngInject
   */
  function EditorCtrl(UserService, PhraseService, DocumentService,
      ContextService, LocaleService, UrlService, StatisticUtil,
      ProjectService, $stateParams) {
    var limit = 50, editorCtrl = this,
        gravatarHash = 'fd8eefdca68e2044a7680d7a0cf574d7';

    //TODO: perform login (cross domain)
    //TODO: need user information when login
    //TODO: Unit test
    //TODO: Localized string

    //Working URL: http://localhost:8000/#/tiny-project/1 or
    // http://localhost:8000/#/tiny-project/1/hello/fr

    //perform login
    //UserService.login('aeng', '79834005e9a0206453cdc9f0a33aef66');

    editorCtrl.gravatarUrl = UrlService.gravatarUrl(gravatarHash, 72);

    ProjectService.getProjectInfo($stateParams.projectSlug).then(
        function(projectInfo) {
          editorCtrl.projectInfo = projectInfo;
        }, function(error) {
          console.error('Error getting project information:' + error);
        });

    editorCtrl.context = ContextService.loadEditorContext(
        $stateParams.projectSlug, $stateParams.versionSlug);

    DocumentService.findAll(editorCtrl.context.projectSlug,
        editorCtrl.context.versionSlug).then(
        function(documents) {
          editorCtrl.documents = documents;

          //if docId is not defined in url, set to first from list
          if (!$stateParams.docId && editorCtrl.documents.length > 0) {
            editorCtrl.context.document = editorCtrl.documents[0];
          } else {
            editorCtrl.context.document = editorCtrl.getDocById(documents,
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
            editorCtrl.context.locale = editorCtrl.getLocaleByLocaleId(locales,
                $stateParams.localeId);
          }
        }, function(error) {
          console.error('Error getting locale list:' + error);
        });

    //Get document by docId from list
    editorCtrl.getDocById = function(documents, docId) {
      for ( var i in documents) {
        if (documents[i].name === docId) {
          return documents[i];
        }
      }
    };

    //Get locale by localeId from list
    editorCtrl.getLocaleByLocaleId = function(locales, localeId) {
      for ( var i in locales) {
        if (locales[i].localeId === localeId) {
          return locales[i];
        }
      }
    };

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
    editorCtrl.loadPhases = function(projectSlug, versionSlug, docId,
                                     localeId) {
      PhraseService.findAll(limit, projectSlug, versionSlug, docId,
          localeId).then(function(phrases) {
        editorCtrl.phrases = phrases;
      });
    };

    this.settings = UserService.settings.editor;
  }

  angular.module('app').controller('EditorCtrl', EditorCtrl);
})();

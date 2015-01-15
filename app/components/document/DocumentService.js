(function() {
  'use strict';

  /**
   * Handle server communication on document related
   * information in project-version.
   *
   * DocumentService.js
   * @ngInject
   */
  function DocumentService($q, $resource, UrlService, StringUtil,
                           StatisticUtil, EventService, _, TransStatusService) {
    var documentService = this,
        statisticMap = {};

    /**
     * Finds all documents in given project version
     *
     * @param _projectSlug
     * @param _versionSlug
     * @returns {$promise|*|N.$promise}
     */
    documentService.findAll = function findAll(_projectSlug, _versionSlug) {
      var Documents = $resource(UrlService.DOCUMENT_LIST_URL, {}, {
        query: {
          method: 'GET',
          params: {
            projectSlug: _projectSlug,
            versionSlug: _versionSlug
          },
          isArray: true
        }
      });
      return Documents.query().$promise;
    };

    /**
     * Get statistic of document in locale (word and message)
     *
     * @param _projectSlug
     * @param _versionSlug
     * @param _docId
     * @param _localeId
     * @returns {*}
     */
    documentService.getStatistics = function (_projectSlug, _versionSlug,
      _docId, _localeId) {
      if (_docId && _localeId) {
        var key = generateStatisticKey(_docId,  _localeId);
        if (_.has(statisticMap, key)) {
          return $q.when(statisticMap[key]);
        } else {
          var encodedDocId = documentService.encodeDocId(_docId);
          var Statistics = $resource(UrlService.DOC_STATISTIC_URL, {}, {
            query: {
              method: 'GET',
              params: {
                projectSlug: _projectSlug,
                versionSlug: _versionSlug,
                docId: encodedDocId,
                localeId: _localeId
              },
              isArray: true
            }
          });
          return Statistics.query().$promise.then(function(statistics) {

            // Make needReview(server) available to needswork
            _.forEach(statistics, function(statistic) {
              statistic[TransStatusService.getId('needswork')] =
                statistic.needReview || 0;
            });

            statisticMap[key] = statistics;
            return statisticMap[key];
          });
        }
      }
    };

    /**
     * Encode docId, replace '/' with ',' when REST call
     * @param docId
     * @returns {*}
     */
    documentService.encodeDocId = function(docId) {
      return docId ? docId.replace(/\//g, ',') : docId;
    };

    /**
     * Encode docId, replace ',' with '/' when REST call
     * @param docId
     * @returns {*}
     */
    documentService.decodeDocId = function(docId) {
      return docId ? docId.replace(/\,/g, '/') : docId;
    };

    documentService.containsDoc = function (documents, docId) {
      return _.any(documents, function(document) {
         return StringUtil.equals(document.name, docId, true);
      });
    };

    documentService.updateStatistic = function(projectSlug, versionSlug, docId,
                                               localeId, oldState,
                                               newState, wordCount) {
      var key = generateStatisticKey(docId, localeId);
      if(_.has(statisticMap, key)) {
        adjustStatistic(statisticMap[key], oldState, newState,
          wordCount);

        EventService.emitEvent(EventService.EVENT.REFRESH_STATISTIC,
          {
            projectSlug: projectSlug,
            versionSlug: versionSlug,
            docId: docId,
            localeId: localeId
          }
        );
      }
    };

    //Generate unique key from docId and localeId for statistic cache
    function generateStatisticKey(docId, localeId) {
      return docId + '-' + localeId;
    }

    /**
     * Adjust statistic based on translation change of state
     * word - -wordCount of oldState, +wordCount of newState
     * msg - -1 of oldState, +1 of newState
     */
    function adjustStatistic(statistics, oldState, newState, wordCount) {

      var wordStatistic = StatisticUtil.getWordStatistic(statistics),
        msgStatistic = StatisticUtil.getMsgStatistic(statistics);

      if(wordStatistic) {
        wordCount = parseInt(wordCount);
        var wordOldState = parseInt(wordStatistic[oldState]) - wordCount;
        wordStatistic[oldState] = wordOldState < 0 ? 0 : wordOldState;
        wordStatistic[newState] = parseInt(wordStatistic[newState]) + wordCount;
      }

      if(msgStatistic) {
        var msgOldState = parseInt(msgStatistic[oldState]) - 1;
        msgStatistic[oldState] = msgOldState < 0 ? 0 : msgOldState;
        msgStatistic[newState] = parseInt(msgStatistic[newState]) + 1;
      }
    }

    return documentService;
  }

  angular
    .module('app')
    .factory('DocumentService', DocumentService);
})();

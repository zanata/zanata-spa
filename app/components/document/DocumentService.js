(function() {
  'use strict';

  /**
   * Handle server communication on document related
   * information in project-version.
   *
   * DocumentService.js
   * @ngInject
   */
  function DocumentService($rootScope, $q, $resource, UrlService, StringUtil,
                           EventService, StatisticUtil, _) {
    var statisticMap = {};

    /**
     * Finds all documents in given project version
     *
     * @param _projectSlug
     * @param _versionSlug
     * @returns {$promise|*|N.$promise}
     */
    function findAll(_projectSlug, _versionSlug) {
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
    }

    /**
     * Get statistic of document in locale (word and message)
     *
     * @param _projectSlug
     * @param _versionSlug
     * @param _docId
     * @param _localeId
     * @returns {*}
     */
    function getStatistics(_projectSlug, _versionSlug,
      _docId, _localeId) {
      if (_docId && _localeId) {
        var key = generateStatisticKey(_docId,  _localeId);
        if (key in statisticMap) {
          return $q.when(statisticMap[key]);
        } else {
          var Statistics = $resource(UrlService.DOC_STATISTIC_URL, {}, {
            query: {
              method: 'GET',
              params: {
                projectSlug: _projectSlug,
                versionSlug: _versionSlug,
                docId: _docId,
                localeId: _localeId
              },
              isArray: true
            }
          });
          return Statistics.query().$promise.then(function(statistics) {
            statisticMap[key] = statistics;
            return statisticMap[key];
          });
        }
      }
    }

    function containsDoc(documents, docId) {
      var contains = false;
      _.every(documents, function (document) {
        if (StringUtil.equals(document.name, docId, true)) {
          contains  = true;
          return false; //break from loop
        }
      });
      return contains;
    }

    function generateStatisticKey(docId, localeId) {
      return docId + '-' + localeId;
    }

    $rootScope.$on(EventService.EVENT.UPDATE_STATISTIC,
      function (event, data) {
        var key = generateStatisticKey(data.docId, data.localeId);
        if(key in statisticMap) {
          //adjust statistic
          adjustStatistic(statisticMap[key], data.oldState, data.newState,
            data.wordCount);
        }
      });

    /**
     * Adjust statistic
     * word - -wordCount of oldState, +wordCount of newState
     * msg - -1 of oldState, +1 of newState
     *
     * @param statistics - statistic to be adjust
     * @param oldState
     * @param newState
     * @param wordCount
     */
    function adjustStatistic(statistics, oldState, newState, wordCount) {
      var wordStatistic = StatisticUtil.getWordStatistic(statistics),
        messageStatistic = StatisticUtil.getMsgStatistic(statistics);

      if(wordStatistic) {
        wordStatistic[oldState] = wordStatistic[oldState] - wordCount;
        wordStatistic[newState] = wordStatistic[newState] + wordCount;
      }
      if(messageStatistic) {
        messageStatistic[oldState] = messageStatistic[oldState] - 1;
        messageStatistic[newState] = messageStatistic[newState] + 1;
      }
    }

    return {
      findAll       : findAll,
      getStatistics : getStatistics,
      containsDoc   : containsDoc
    };
  }

  angular
    .module('app')
    .factory('DocumentService', DocumentService);
})();

(function () {
  'use strict';

  /**
   * PhraseCache.js
   * Stores textflow, states in local cache.
   * TODO: use angular-data for storage
   * @ngInject
   */
  function PhraseCache($q, $resource, FilterUtil, UrlService, DocumentService,
                       _) {
    var phraseCache = this,
      states = {}, //ids and states of all tu in order
      transUnits = {};

    phraseCache.getStates =
      function (projectSlug, versionSlug, documentId, localeId) {
        var key = generateKey(projectSlug, versionSlug, documentId, localeId);
        if (_.has(states, key)) {
          return $q.when(states[key]);
        } else {
          var encodedDocId = DocumentService.encodeDocId(documentId);
          var methods = {
              query: {
                method: 'GET',
                params: {
                  projectSlug: projectSlug,
                  versionSlug: versionSlug,
                  docId: encodedDocId,
                  localeId: localeId
                },
                isArray: true
              }
            },
            States = $resource(UrlService.TRANSLATION_STATUS_URL, {}, methods);
          return States.query().$promise.then(function (state) {
            state = FilterUtil.cleanResourceList(state);
            states[key] = state;
            return states[key];
          });
        }
      };

    phraseCache.getTransUnits = function (ids, localeId) {
      var results = {},
        missingTUId = [],
        missingLocaleTUId = [];
      ids.forEach(function (id) {
        if (_.has(transUnits, id)) {
          if(transUnits[id][localeId]) {
            results[id] = transUnits[id];
          } else {
            missingLocaleTUId.push(id);
          }
        } else {
          missingTUId.push(id);
        }
      });
      if (_.isEmpty(missingTUId) && _.isEmpty(missingLocaleTUId)) {
        return $q.when(results);
      }
      else {
        var TextFlows, Translations;
        if(!_.isEmpty(missingTUId)) {
          TextFlows = $resource(UrlService.TEXT_FLOWS_URL, {}, {
            query: {
              method: 'GET',
              params: {
                localeId: localeId,
                ids: missingTUId.join(',')
              }
            }
          });
        }
        if(!_.isEmpty(missingLocaleTUId)) {
          Translations = $resource(UrlService.TRANSLATION_URL, {}, {
            query: {
              method: 'GET',
              params: {
                localeId: localeId,
                ids: missingLocaleTUId.join(',')
              }
            }
          });
        }

        //need to create chain of promises
        if(TextFlows && Translations) {
          return TextFlows.query().$promise.then(updateCacheWithNewTU).
            then(Translations.query().$promise.then(updateCacheWithExistingTU));
        } else if(TextFlows) {
          return TextFlows.query().$promise.then(updateCacheWithNewTU);
        } else if(Translations) {
          return Translations.query().$promise.then(updateCacheWithExistingTU);
        }
      }

      function updateCacheWithExistingTU(newTransUnits) {
        newTransUnits = FilterUtil.cleanResourceMap(newTransUnits);
        for (var key in newTransUnits) {
          //push to cache
          transUnits[key][localeId] = newTransUnits[key][localeId];
          results[key] = transUnits[key]; //merge with results
        }
        return results;
      }

      function updateCacheWithNewTU(newTransUnits) {
        newTransUnits = FilterUtil.cleanResourceMap(newTransUnits);
        for (var key in newTransUnits) {
          transUnits[key] = newTransUnits[key]; //push to cache
          results[key] = transUnits[key]; //merge with results
        }
        return results;
      }
    };

    /**
     * On translation updated from server
     * @param id
     * @param localeId
     * @param revision
     * @param state
     * @param content
     * @param contents
     */
    phraseCache.onTransUnitUpdated =
      function (context, id, localeId, revision, status, phrase) {

        var key = generateKey(context.projectSlug, context.versionSlug,
          context.docId, localeId);

        var stateEntry = _.find(states[key], function(stateEntry) {
          return stateEntry.id === id;
        });
        //Update states cache
        if(stateEntry) {
          stateEntry.state = status;
        }

        //Update transUnits cache
        var translation = transUnits[id][localeId];
        if (!translation) {
          translation = {};
        }
        translation.revision = parseInt(revision);
        translation.state = status;
        translation.contents = phrase.newTranslations.slice();
      };

    function generateKey(projectId, versionId, documentId, localeId) {
      return projectId + '-' + versionId + '-' +
        documentId + '-' + localeId;
    }

    return phraseCache;
  }

  angular
    .module('app')
    .factory('PhraseCache', PhraseCache);

})();

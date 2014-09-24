(function() {
  'use strict';

  /**
   * PhraseCache.js
   * Stores textflow, states in local cache.
   * TODO: use angular-data for storage
   * @ngInject
   */
  function PhraseCache($q, $resource, FilterUtil, UrlService, _) {
    var phraseCache = this,
      states = {}, //ids and states of all tu in order
      transUnits = {};

    phraseCache.getStates = function (projectId, versionId,
                                        documentId, localeId) {
      var key = generateKey(projectId, versionId, documentId, localeId);
      if( _.has(states, key)) {
        return $q.when(states[key]);
      } else {
        var methods = {
            query: {
              method: 'GET',
              params: {
                projectSlug: projectId,
                versionSlug: versionId,
                // This must be encoded for URL, is it passed encoded?
                docId: documentId,
                localeId: localeId
              },
              isArray: true
            }
        },
        States = $resource(UrlService.TRANSLATION_STATES_URL, {}, methods);
        return States.query().$promise.then(function(state) {
          state = FilterUtil.cleanResourceList(state);
          states[key] = state;
          return states[key];
        });
      }
    };

    phraseCache.getTransUnits = function (ids, localeId) {
      var results = {},
        missingTUId = [];

      ids.forEach(function(id) {
        if(_.has(transUnits, id)) {
          results[id] = transUnits[id];
        } else {
          missingTUId.push(id);
        }
      });
      if(missingTUId.length <= 0) {
        return $q.when(results);
      }
      else {
        var TextFlows = $resource(UrlService.TEXT_FLOWS_URL, {}, {
          query: {
            method: 'GET',
            params: {
              localeId: localeId,
              ids: missingTUId.join(',')
            }
          }
        });
        return TextFlows.query().$promise.then(function(newTransUnits) {
          newTransUnits = FilterUtil.cleanResourceMap(newTransUnits);
          for (var key in newTransUnits) {
            transUnits[key]  = newTransUnits[key]; //push to cache
            results[key] = newTransUnits[key]; //merge with results
          }
          return results;
        });
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
    phraseCache.onTransUnitUpdated = function(id, localeId, revision, state,
                                              content, contents) {
      //Update states cache
      states[id] = state;

      //Update transUnits cache
      var translation = transUnits[id][localeId];
      if(!translation) {
        translation = {};
      }
      translation.revision = parseInt(revision);
      translation.state = state;
      translation.content = content;
      translation.contents = contents;
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

(function () {
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

    phraseCache.getStates =
      function (projectSlug, versionSlug, documentId, localeId) {
        var key = generateKey(projectSlug, versionSlug, documentId, localeId);
        if (_.has(states, key)) {
          return $q.when(states[key]);
        } else {
          var methods = {
              query: {
                method: 'GET',
                params: {
                  projectSlug: projectSlug,
                  versionSlug: versionSlug,
                  // This must be encoded for URL, is it passed encoded?
                  docId: documentId,
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
        missingTUId = [];

      ids.forEach(function (id) {
        if (_.has(transUnits, id)) {
          results[id] = transUnits[id];
        } else {
          missingTUId.push(id);
        }
      });
      if (missingTUId.length <= 0) {
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
        return TextFlows.query().$promise.then(function (newTransUnits) {
          newTransUnits = FilterUtil.cleanResourceMap(newTransUnits);
          for (var key in newTransUnits) {
            transUnits[key] = newTransUnits[key]; //push to cache
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
    phraseCache.onTransUnitUpdated =
      function (context, id, localeId, revision, status, content, contents) {

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

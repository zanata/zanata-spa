(function () {
  'use strict';

/**
 * @name PhraseService
 * @description Provides a list of phrases for the current document(s)
 */
function PhraseService ($q, $filter, $resource, UrlService) {
  var phraseService = {};

  // FIXME move limit to end so it can be omitted
  // FIXME use an object for all the ID arguments - in general we will only
  //       need to modify such an object sporadically when switching document
  //       or locale, and it is neater than passing them all around separately.
  phraseService.findAll = function(limit, projectId,
                                   versionId, documentId,
                                   locale) {

    // Reading for chaining promises https://github.com/kriskowal/q
    // (particularly "Sequences").

    // return a promise that is fulfilled with the text flows.
    return requestStates().then(requestTextFlows);

    /**
     * Fetch full list of translation states for each string in this document.
     *
     * Returns a promise that is fulfilled when the request completes.
     */
    function requestStates() {
      var methods = {
        query: {
          method: 'GET',
          params: {
            projectSlug: projectId,
            versionSlug: versionId,
            // This must be encoded for URL, is it passed encoded?
            docId: documentId,
            localeId: locale
          },
          isArray: true
        }
      };
      var States = $resource(UrlService.TRANSLATION_STATES_URL, {}, methods);

      return States.query().$promise;
    }

    /**
     * Fetch each of the text flows appearing in the given states data.
     *
     * Returns a promise that is fulfilled when the request completes.
     */
    function requestTextFlows(states) {
      // TODO also want to save the states somewhere. Could make a separate
      //      function as a decorator.

      // States is an array of objects, and I want key "id" from each object.
      var ids = [];
      states.forEach(function (item) {
        ids.push(item.id);
      });

      if (limit) {
        ids = $filter('limitTo')(ids, limit);
      }

      var TextFlows = $resource(UrlService.TEXT_FLOWS_URL, {}, {
        query: {
          method: 'GET',
          params: {
            localeId: locale,
            ids: ids.join(',')
          }
        }
      });

      return TextFlows.query().$promise.then(transformToPhrases);
    }

    /**
     * Converts text flow data from the API into the form expected in the
     * editor.
     */
    function transformToPhrases(textFlows) {
      // TODO caching textFlow data in a smart cache when it arrives.

      var phrases = [];

      // a few properties of the object are added by the promise
      // (all those starting with $, textflow id never contains $).
      var ids = Object.keys(textFlows).filter(function (id) {
        return id.indexOf('$') === -1;
      });

      ids.forEach(function (id) {
        var textFlow = textFlows[id],
            source = textFlow.source,
            trans = textFlow[locale];
        phrases.push({
          id: parseInt(id),
          // TODO handle plural content
          source: source.content,
          translation: trans ? trans.content : '',
          newTranslation: trans ? trans.content : '',
          status: trans ? trans.state : 'Untranslated'
        });
      });
      return phrases;
    }
  };

  return phraseService;
}

angular
  .module('app')
  .factory('PhraseService', PhraseService);

})();

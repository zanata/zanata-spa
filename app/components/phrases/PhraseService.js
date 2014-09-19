(function () {
  'use strict';

  /**
   * @name PhraseService
   * @description Provides a list of phrases for the current document(s)
   */
  function PhraseService($filter, $resource, UrlService, TransUnitService,
                         FilterUtil) {
    var phraseService = {},
      stateCssClass =  {};

    stateCssClass[TransUnitService.TU_STATE.UNTRANSLATED.toLowerCase()] =
      'untranslated';
    stateCssClass[TransUnitService.TU_STATE.NEED_REVIEW.toLowerCase()] =
      'needsWork';
    stateCssClass[TransUnitService.TU_STATE.APPROVED.toLowerCase()] =
      'approved';
    stateCssClass[TransUnitService.TU_STATE.TRANSLATED.toLowerCase()] =
      'translated';

    //id and states of all tu
    phraseService.states = [];


    // FIXME use an object for all the ID arguments - in general we will only
    // need to modify such an object sporadically when switching document
    // or locale, and it is neater than passing them all
    // around separately.


    /**
     * Fetch full list of translation states for each string in this document.
     *
     * Returns a promise that is fulfilled when the request completes.
     */
    phraseService.getStates = function (projectId, versionId,
                                        documentId, locale) {
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
        },
        States = $resource(UrlService.TRANSLATION_STATES_URL, {}, methods);
      return States.query().$promise;
    };

    /**
     * Fetch each of the text flows appearing in the given states data.
     */
    phraseService.getPhrase = function (locale, filter, offset, maxResult) {
      var ids = getIds(phraseService.states, filter.states);

      if (offset) {
        if(maxResult) {
          ids = ids.slice(offset, offset + maxResult);
        } else {
          ids = ids.slice(offset);
        }
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

      // Reading for chaining promises https://github.com/kriskowal/q
      // (particularly "Sequences").
      return TextFlows.query().$promise.then(transformToPhrases);

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
            translation: trans ? trans.content : '',//original translation
            newTranslation: trans ? trans.content : '',//translation from editor
            status: trans ? trans.state :
              TransUnitService.TU_STATE.UNTRANSLATED,
            statusClass: getStatusClass(trans)
          });
        });
        return phrases;
      }
    };

    function getIds(resources, states) {
      if(states) {
        resources = FilterUtil.filterResources(resources, ['state'], states);
      }
      return _.map(resources, function (item) {
        return item.id;
      });
    }

    function getStatusClass(trans) {
      if(!trans) {
        return 'untranslated';
      }
      var cssClass = stateCssClass[trans.state.toLowerCase()];
      return cssClass || 'untranslated';
    }


    // Does not appear to be used anywhere. Removing until phrase-caching code
    // is added.
    // phraseService.findById = function(phraseId) {
    //   var deferred = $q.defer();
    //   var phrase = phrases[phraseId];
    //   deferred.resolve(phrase);
    //   return deferred.promise;
    // };

    return phraseService;
  }

  angular
    .module('app')
    .factory('PhraseService', PhraseService);

})();

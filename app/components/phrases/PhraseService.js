(function () {
  'use strict';

  /**
   * @name PhraseService
   * @description Provides a list of phrases for the current document(s)
   */
  function PhraseService(TransUnitService, FilterUtil, PhraseCache, _) {
    var phraseService = {},
      stateCssClass =  {};

    phraseService.phrases = []; //current displayed phrases

    stateCssClass[TransUnitService.TU_STATE.UNTRANSLATED.toLowerCase()] =
      'untranslated';
    stateCssClass[TransUnitService.TU_STATE.NEED_REVIEW.toLowerCase()] =
      'needsWork';
    stateCssClass[TransUnitService.TU_STATE.APPROVED.toLowerCase()] =
      'approved';
    stateCssClass[TransUnitService.TU_STATE.TRANSLATED.toLowerCase()] =
      'translated';

    // FIXME use an object for all the ID arguments - in general we will only
    // need to modify such an object sporadically when switching document
    // or locale, and it is neater than passing them all
    // around separately.


    /**
     * Fetch each of the text flows appearing in the given states data.
     */
    phraseService.fetchAllPhrase = function (context, filter, states,
                                             offset, maxResult) {

      var localeId = context.localeId;

      return PhraseCache.getStates(context.projectSlug, context.versionSlug,
        context.docId, localeId).then(getTransUnits);

      function getTransUnits(states) {
        var ids = getIds(states, filter.states);
        if (offset) {
          if(maxResult) {
            ids = ids.slice(offset, offset + maxResult);
          } else {
            ids = ids.slice(offset);
          }
        }
        // Reading for chaining promises https://github.com/kriskowal/q
        // (particularly "Sequences").
        return PhraseCache.getTransUnits(ids, localeId).
          then(transformToPhrases).then(sortPhrases);
      }

      /**
       * Converts text flow data from the API into the form expected in the
       * editor.
       */
      function transformToPhrases(transUnits) {
        var phrases = [];

        for (var id in transUnits) {
          var source = transUnits[id].source,
            trans = transUnits[id][localeId];
          phrases.push({
            id: parseInt(id),
            // TODO handle plural content
            source: source.content,
            translation: trans ? trans.content : '',//original translation
            newTranslation: trans ? trans.content : '',//translation from editor
            status: trans ? trans.state :
              TransUnitService.TU_STATE.UNTRANSLATED,
            revision: trans ? parseInt(trans.revision) : 0,
            statusClass: getStatusClass(trans),
            wordCount: parseInt(source.wordCount)
          });
        }
        return phrases;
      }

      function sortPhrases(phrases) {
        return PhraseCache.getStates(context.projectSlug, context.versionSlug,
          context.docId, localeId).then(function(states) {
            phraseService.phrases = _.sortBy(phrases, function(phrase) {
              var index = _.findIndex(states, function(state) {
                return state.id === phrase.id;
              });
              return index >= 0 ? index : phrases.length;
            });
            return phraseService.phrases;
          });
      }
    };

    //update phrase,states and textFlows with given tu id
    phraseService.onTransUnitUpdated = function(id, localeId, revision,
                                                state, content, contents) {
      PhraseCache.onTransUnitUpdated(id, localeId, revision, state, content,
        contents);

      var phrase = findPhrase(id, phraseService.phrases);
      //update phrase if found
      if(phrase) {
        phrase.translation = content;
        phrase.revision = revision;
        phrase.status = state;
        phrase.statusClass = stateCssClass[state.toLowerCase()] ||
          'untranslated';
      }
    };

    //rollback content of phrase
    phraseService.onTransUnitUpdateFailed = function(id) {
      var phrase = findPhrase(id, phraseService.phrases);
      if(phrase) {
        phrase.newTranslation = phrase.translation;
      }
    };

    function findPhrase(id, phrases) {
      return _.find(phrases, function(phrase) {
        return phrase.id === id;
      });
    }

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

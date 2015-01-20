(function () {
  'use strict';

  /**
   * @typedef {Object} Phrase
   * @property {number} id text flow id
   * @property {string} source source content
   * @property {string[]} sources source contents if it's plural
   * @property {string} translation original translation content
   * @property {string[]} translations original translation plural contents
   * @property {string} newTranslation translation in the editor
   * @property {string[]} newTranslations translations in the editor
   * @property {boolean} plural whether it's in plural form
   * @property {StatusInfo} status information about this phrase
   * @property {number} revision translation revision number
   * @property {number} wordCount source word count
   */
  /**
   * @name PhraseService
   * @description Provides a list of phrases for the current document(s)
   *
   * @ngInject
   */
  function PhraseService(FilterUtil, PhraseCache, TransStatusService, _,
                         $stateParams) {
    var phraseService = {};

    phraseService.phrases = []; //current displayed phrases

    // FIXME use an object for all the ID arguments - in general we will only
    // need to modify such an object sporadically when switching document
    // or locale, and it is neater than passing them all
    // around separately.

    phraseService.getPhraseCount = function(context, filter) {
      return PhraseCache.getStates(context.projectSlug, context.versionSlug,
        context.docId, context.localeId).then(function(states) {
          var ids = getIds(states, filter.status);
          return ids.length;
        });
    };

    phraseService.isTranslationModified = function(phrase) {
      if (phrase.plural) {
        // on Firefox with input method turned on,
        // when hitting tab it seems to turn undefined value into ''
        var allSame = _.every(phrase.translations,
          function(translation, index) {
            return nullToEmpty(translation) ===
              nullToEmpty(phrase.newTranslations[index]);
          });
        return !allSame;
      }
      else {
        return nullToEmpty(phrase.newTranslation) !==
          nullToEmpty(phrase.translation);
      }
    };

    function nullToEmpty(value) {
      return value || '';
    }

    /**
     * Fetch each of the text flows appearing in the given states data.
     */
    phraseService.fetchAllPhrase = function (context, filter,
                                             offset, maxResult) {

      var localeId = context.localeId;

      return PhraseCache.getStates(context.projectSlug, context.versionSlug,
        context.docId, localeId).then(getTransUnits);

      function getTransUnits(states) {
        var ids = getIds(states, filter.status);
        if (!isNaN(offset)) {
          if(!isNaN(maxResult)) {
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
       *
       * @returns {Phrase[]}
       */
      function transformToPhrases(transUnits) {
        return _.map(transUnits, function(transUnit, id) {
          var source = transUnit.source,
              trans = transUnit[localeId];
          return {
            id: parseInt(id),
            // TODO: handle plural content
            source: source.content,
            sources: source.contents,
            // Original translation
            translation: trans ? trans.content : '',
            translations: trans && trans.contents ?
              trans.contents.slice() : [],
            // Translation from editor
            newTranslation: trans ? trans.content : '',
            newTranslations: trans && trans.contents ?
              trans.contents.slice() : [],
            plural: source.plural,
            // Conform the status from the server, return an object
            status: trans ? TransStatusService.getStatusInfo(trans.state) :
              TransStatusService.getStatusInfo('untranslated'),
            revision: trans ? parseInt(trans.revision) : 0,
            wordCount: parseInt(source.wordCount)
          };
        });
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

    //update phrase,statuses and textFlows with given tu id
    phraseService.onTransUnitUpdated = function(context, id, localeId, revision,
      status, phrase) {

      PhraseCache.onTransUnitUpdated(context, id, localeId, revision, status,
        phrase);

      var cachedPhrase = findPhrase(id, phraseService.phrases);
      //update phrase if found
      if(cachedPhrase) {
        cachedPhrase.translation = phrase.newTranslation;
        cachedPhrase.translations = phrase.newTranslations.slice();
        cachedPhrase.revision = revision;
        cachedPhrase.status = TransStatusService.getStatusInfo(status);
      }
    };

    //rollback content of phrase
    phraseService.onTransUnitUpdateFailed = function(id) {
      var phrase = findPhrase(id, phraseService.phrases);
      if(phrase) {
        phrase.newTranslation = phrase.translation;
      }
    };

    // find next Id from phrases states
    phraseService.findNextId = function(currentId) {
      return PhraseCache.getStates($stateParams.projectSlug,
                                   $stateParams.versionSlug, $stateParams.docId,
                                   $stateParams.localeId)
        .then(function (states) {
          var currentIndex,
            nextIndex;
          currentIndex = _.findIndex(states, function (state) {
            return state.id === currentId;
          });
          nextIndex = currentIndex + 1 < states.length ?
            currentIndex + 1 : states.length - 1;
          return states[nextIndex].id;
        });
    };

    // find previous id from phrases states
    phraseService.findPreviousId = function(currentId) {
      return PhraseCache.getStates($stateParams.projectSlug,
                                   $stateParams.versionSlug, $stateParams.docId,
                                   $stateParams.localeId)
        .then(function (states) {
          var currentIndex,
            previousIndex;
          currentIndex = _.findIndex(states, function (state) {
            return state.id === currentId;
          });
          previousIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : 0;
          return states[previousIndex].id;
        });
    };

    // find next phrase with requested status
    phraseService.findNextStatus = function(currentId, status) {
      return PhraseCache.getStates($stateParams.projectSlug,
                                   $stateParams.versionSlug, $stateParams.docId,
                                   $stateParams.localeId)
        .then(function (statusList) {
          var currentIndex,
            nextStatusInfo,
            requestStatus = TransStatusService.getStatusInfo(status);

          currentIndex = _.findIndex(statusList, function (state) {
            return state.id === currentId;
          });

          for (var i = currentIndex + 1; i < statusList.length; i++) {
            nextStatusInfo = TransStatusService.getStatusInfo(
              statusList[i].state);
            if (nextStatusInfo.ID === requestStatus.ID) {
              return statusList[i].id;
            }
          }
          return currentId;
        });
    };

    function findPhrase(id, phrases) {
      return _.find(phrases, function(phrase) {
        return phrase.id === id;
      });
    }

    function getIds(resources, states) {
      if(states) {
        resources = FilterUtil.filterResources(resources, ['status'], states);
      }
      return _.map(resources, function (item) {
        return item.id;
      });
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


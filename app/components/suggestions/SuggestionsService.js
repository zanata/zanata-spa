(function() {
  'use strict';

  /**
   * @typedef {Object} ImportedMatchDetail
   * @param {string} type - 'IMPORTED_TM'
   * @param {number} transMemoryUnitId - numeric identifier for this translation
   *                         memory unit on the server
   * @param {string} transMemorySlug - identifier for the translation memory
   *                         that contains this translation unit
   * @param {string} transUnitId - optional identifier for this translation unit
   * @param {string} lastChanged - date that this text flow was last changed, in
   *                         ISO-8601 format
   */

  /**
   * @typedef {Object} LocalMatchDetail
   * @param {string} type - 'LOCAL_PROJECT'
   * @param {number} textFlowId - numeric identifier for this text flow on the
   *                         server
   * @param {string} contentState - 'Translated' or 'Approved'
   * @param {string} projectId - identifier for the project that this text flow
   *                         is in
   * @param {string} projectName - display name for the project that this text
   *                         flow is in
   * @param {string} version - identifier for the version that this text flow is
   *                         in
   * @param {string} documentPath - file path of the document that contains this
   *                         text flow.
   * @param {string} documentName - file name of the document that contains this
   *                         text flow, without the file path
   * @param {string} resId - natural id for this text flow within the document
   * @param {string} lastModifiedDate - date that this text flow was last
   *                         changed, in ISO-8601 format
   * @param {string} lastModifiedBy - username of the user who last modified
   *                         this text flow
   */

  /**
   * @typedef {(ImportedMatchDetail|LocalMatchDetail)} MatchDetail
   */

  /**
   * @typedef {Object} Suggestion
   * @param {number} relevanceScore - score from the search engine indicating
   *                         how close a match it considers this to the query.
   *                         It is sensible to compare scores within a query,
   *                         but not between queries.
   * @param {number} similarityPercent - proportion of the characters in
   *                         sourceContents that match the query
   * @param {Array<string>} sourceContents - suggested source text that is
   *                                similar to the search
   * @param {Array<string>} targetContents - translations of the suggested
   *                                source text
   * @param {Array<MatchDetail>} matchDetails - summary of all the sources with
   *                                     the same source and target contents
   */

  /**
   * Provide suggestions based on given source text.
   *
   * SuggestionsService.js
   * @ngInject
   */
  function SuggestionsService(EditorService, EventService, UrlService,
                              $resource) {

    /**
     * Get a list of suggestions for how to translate a piece of text.
     *
     * @param {string} searchText
     * @return {Promise<Array<Suggestion>>} suggestions for translating the
     *                                      given text
     */
    function getSuggestionsForText(searchText) {
      return getSuggestionsForContents([searchText]);
    }

    /**
     * Get a list of suggestions for how to translate a phrase.
     *
     * @param {Phrase} phrase the source text to find suggestions for
     * @returns {Promise<Array<Suggestion>>} suggestions for translating the
     *                                       given phrase
     */
    function getSuggestionsForPhrase(phrase) {
      return getSuggestionsForContents(phrase.sources)
        .then(function (suggestions) {
          EventService.emitEvent(EventService.EVENT.PHRASE_SUGGESTION_COUNT,
            { id: phrase.id, count: suggestions.length });
          return suggestions;
        });
    }

    /**
     * Get a list of suggestions for how to translate a list of strings.
     *
     * @param contents {Array<string>} source strings to find matches for
     * @returns {Promise<Array<Suggestion>>}
     */
    function getSuggestionsForContents(contents) {
      var sourceLocale = EditorService.context.srcLocale.localeId;
      var transLocale = EditorService.context.localeId;

      var postQuery = {
        query: {
          method: 'POST',
          params: {
            from: sourceLocale,
            to: transLocale,
            searchType: 'FUZZY_PLURAL'
          },
          isArray: true
        }
      };

      var Suggestions = $resource(UrlService.SUGGESTIONS_URL, {}, postQuery);
      return Suggestions.query({}, contents).$promise;
    }

    return {
      getSuggestionsForPhrase: getSuggestionsForPhrase,
      getSuggestionsForText: getSuggestionsForText
    };
  }

  angular
    .module('app')
    .factory('SuggestionsService', SuggestionsService);
})();

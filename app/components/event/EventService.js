(function () {
  'use strict';

  /**
   * EventService.js
   * Broadcast events service in app.
   * Usage: EventService.emitEvent(<String> event, <Map> data, scope)
   * See EventService.emitEvent
   *
   * @ngInject
   */
  function EventService($rootScope) {
    var eventService = this;
    eventService.EVENT = {
      /**
       * Loading Events
       *
       * Broadcast from AppConfig
       */
      LOADING_START: 'loadingStart',
      LOADING_STOP: 'loadingStop',

      /**
       * scroll to trans unit
       * data: {id: number, updateURL: boolean, focus: boolean}
       * id: (transunit id),
       * updateURL: (flag on whether to update url with trans unit id)
       * focus: flag on whether to have row in view and focused
       */
      SELECT_TRANS_UNIT: 'selectTransUnit',

      //data: {phrase: Phrase, sourceIndex:sourceIndex}
      COPY_FROM_SOURCE: 'copyFromSource',

      //data: {phrase: Phrase}
      UNDO_EDIT: 'undoEdit',

      //data: {phrase: Phrase}
      CANCEL_EDIT: 'cancelEdit',

      //data:phrase
      FOCUS_TRANSLATION: 'focusTranslation',

      /**
       * data: {
       *  phrase: Phrase, status: StatusInfo, locale: string, docId: string
       * }
       * phrase:
       * status: Object. Request save state
       * locale: target locale
       * docId: docId
       */
      SAVE_TRANSLATION: 'saveTranslation',

      /**
       * Translation save in this editor is being sent to the server and
       * is waiting on a response.
       */
      SAVE_INITIATED: 'saveInitiated',

      /**
       * Translation save in this editor has been completed
       * (Server has responded with a success or error).
       */
      SAVE_COMPLETED: 'saveCompleted',

      /**
       * The text in the translation editor textbox has been edited and
       * not yet saved.
       */
      TRANSLATION_TEXT_MODIFIED: 'translationTextModified',

      /**
       * refresh ui statistic - changes in doc or locale
       *
       * data: {projectSlug: string, versionSlug: string,
       *  docId: string, localeId: string}
       */
      REFRESH_STATISTIC: 'refreshStatistic',

      GOTO_PREV_PAGE: 'gotoPreviousPage',

      GOTO_NEXT_PAGE: 'gotoNextPage',

      GOTO_FIRST_PAGE: 'gotoFirstPage',

      GOTO_LAST_PAGE: 'gotoLastPage',

      /**
       * data: { currentId: number }
       */
      GOTO_NEXT_ROW: 'gotoNextRow',
      GOTO_PREVIOUS_ROW: 'gotoPreviousRow',
      GOTO_NEXT_UNTRANSLATED: 'gotoNextUntranslated',

      /**
       * Toggle save as options dropdown.
       * data: {id: number, open: boolean}
       */
      TOGGLE_SAVE_OPTIONS: 'openSaveOptions',


      /**
       * data: {filter: refer to editorCtrl.filter}
       */
      FILTER_TRANS_UNIT: 'filterTransUnit'
    };

    /**
     * Firing an event downwards of scope
     *
     * @param event - eventService.EVENT type
     * @param data - data for the event
     * @param scope - scope of event to to fire, $rootScope if empty
     */
    eventService.broadcastEvent = function(event, data, scope) {
      scope = scope || $rootScope;
      scope.$broadcast(event, data);
    };

    /**
     * Firing an event upwards of scope
     *
     * @param event - eventService.EVENT types
     * @param data - data for the event
     * @param scope - scope of event to to fire, $rootScope if empty
     */
    eventService.emitEvent = function(event, data, scope) {
      scope = scope || $rootScope;
      scope.$emit(event, data);
    };

    return eventService;
  }

  angular
    .module('app')
    .factory('EventService', EventService);
})();

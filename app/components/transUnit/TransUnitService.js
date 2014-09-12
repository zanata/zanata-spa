(function () {
  'use strict';

  /**
   * TransUnitService.js
   *
   * @ngInject
   */
  function TransUnitService($rootScope, EventService) {
    var transUnitService = this,
      selectedTUScope;

    /**
     * EventService.EVENT.SELECT_TRANS_UNIT listener
     * Select and focus a trans-unit
     */
    $rootScope.$on(EventService.EVENT.SELECT_TRANS_UNIT,
      function (event, translationScope) {
        if (selectedTUScope &&
          selectedTUScope.phrase.id !== translationScope.phrase.id) {
          setFocus(selectedTUScope, false);
        }
        selectedTUScope = translationScope;
        setFocus(selectedTUScope, true);
      });

    /**
     * EventService.EVENT.COPY_FROM_SOURCE listener
     * Copy translation from source
     */
    $rootScope.$on(EventService.EVENT.COPY_FROM_SOURCE,
      function (event, phrase) {
        phrase.newTranslation = phrase.source;
        selectedTUScope.phrase.modified = true;
      });

    /**
     * EventService.EVENT.CANCEL_EDIT listener
     * Cancel edit and restore translation
     */
    $rootScope.$on(EventService.EVENT.CANCEL_EDIT,
      function (event, translationScope) {
        if (selectedTUScope.phrase.modified &&
          selectedTUScope.phrase.modified === true) {
          translationScope.phrase.newTranslation =
            translationScope.phrase.translation;
        }
        setFocus(translationScope, false);
        selectedTUScope = '';
      });

    function setFocus(transUnitScope, isFocus) {
      if (isFocus && isFocus === true) {
        transUnitScope.selected = true;
      } else {
        transUnitScope.selected = false;
      }
    }

    return transUnitService;
  }

  angular
    .module('app')
    .factory('TransUnitService', TransUnitService);
})();

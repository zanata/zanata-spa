(function() {
  'use strict';

  /**
   * PhraseUtil.js
   *
   * @ngInject
   */
  function PhraseUtil(TransStatusService) {

    function getSaveButtonStatus(phrase) {
      if (phrase.newTranslation === '') {
        return TransStatusService.getStatusInfo('untranslated');
      }
      else if (phrase.translation !== phrase.newTranslation) {
        return TransStatusService.getStatusInfo('translated');
      } else {
        return phrase.status;
      }
    }

    return {
      getSaveButtonStatus  : getSaveButtonStatus
    };
  }
  angular
    .module('app')
    .factory('PhraseUtil', PhraseUtil);
})();

(function() {
  'use strict';

  /**
   * PhraseUtil.js
   *
   * @ngInject
   */
  function PhraseUtil(TransStatusService, _) {

    function getSaveButtonStatus(phrase) {
      if (phrase.plural) {
        var newTranslations = phrase.newTranslations,
            translations = phrase.translations;
        if (_.isEmpty(_.compact(newTranslations))) {
          return TransStatusService.getStatusInfo('untranslated');
        }
        else if (_.compact(newTranslations).length !== newTranslations.length) {
          return TransStatusService.getStatusInfo('needswork');
        }
        else if (!_.isEmpty(_.difference(newTranslations, translations))) {
          return TransStatusService.getStatusInfo('translated');
        }
        else {
          return phrase.status;
        }
      }
      else {
        if (phrase.newTranslation === '') {
          return TransStatusService.getStatusInfo('untranslated');
        }
        else if (phrase.translation !== phrase.newTranslation) {
          return TransStatusService.getStatusInfo('translated');
        }
        else {
          return phrase.status;
        }
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

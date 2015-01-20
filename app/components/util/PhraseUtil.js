(function() {
  'use strict';

  /**
   * PhraseUtil.js
   *
   * @ngInject
   */
  function PhraseUtil(TransStatusService, _) {

    function getSaveButtonStatus(phrase) {
      var newTranslations = phrase.newTranslations;
      if (_.isEmpty(_.compact(newTranslations))) {
        return TransStatusService.getStatusInfo('untranslated');
      }
      else if (_.compact(newTranslations).length !== newTranslations.length) {
        return TransStatusService.getStatusInfo('needswork');
      }
      else if (hasTranslationChanged(phrase)) {
        return TransStatusService.getStatusInfo('translated');
      }
      else {
        return phrase.status;
      }
    }

    function hasTranslationChanged(phrase) {
      // on Firefox with input method turned on,
      // when hitting tab it seems to turn undefined value into ''
      var allSame = _.every(phrase.translations,
        function(translation, index) {
          return nullToEmpty(translation) ===
            nullToEmpty(phrase.newTranslations[index]);
        });
      return !allSame;
    }

    function nullToEmpty(value) {
      return value || '';
    }

    return {
      getSaveButtonStatus  : getSaveButtonStatus,
      hasTranslationChanged: hasTranslationChanged
    };
  }
  angular
    .module('app')
    .factory('PhraseUtil', PhraseUtil);
})();

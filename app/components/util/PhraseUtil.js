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
      else {
        if (_.isEmpty(phrase.newTranslation)) {
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

    function hasTranslationChanged(phrase) {
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
    }

    function nullToEmpty(value) {
      return value || '';
    }

    return {
      getSaveButtonStatus  : getSaveButtonStatus
    };
  }
  angular
    .module('app')
    .factory('PhraseUtil', PhraseUtil);
})();

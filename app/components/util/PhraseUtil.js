(function () {
  'use strict'

  /**
   * PhraseUtil.js
   *
   * @ngInject
   */
  function PhraseUtil (TransStatusService, _) {
    function getSaveButtonStatus (phrase) {
      if (hasNoTranslation(phrase)) {
        return TransStatusService.getStatusInfo('untranslated')
      } else if (hasEmptyTranslation(phrase)) {
        return TransStatusService.getStatusInfo('needswork')
      } else if (hasTranslationChanged(phrase)) {
        return TransStatusService.getStatusInfo('translated')
      } else {
        return phrase.status
      }
    }

    function hasTranslationChanged (phrase) {
      // on Firefox with input method turned on,
      // when hitting tab it seems to turn undefined value into ''
      var allSame = _.every(phrase.translations,
        function (translation, index) {
          return nullToEmpty(translation) ===
            nullToEmpty(phrase.newTranslations[index])
        })
      return !allSame
    }

    function hasNoTranslation (phrase) {
      return _.isEmpty(_.compact(phrase.newTranslations))
    }

    function hasEmptyTranslation (phrase) {
      return _.compact(phrase.newTranslations).length !==
        phrase.newTranslations.length
    }

    function nullToEmpty (value) {
      return value || ''
    }

    return {
      getSaveButtonStatus: getSaveButtonStatus,
      hasTranslationChanged: hasTranslationChanged,
      hasNoTranslation: hasNoTranslation,
      hasEmptyTranslation: hasEmptyTranslation
    }
  }
  angular
    .module('app')
    .factory('PhraseUtil', PhraseUtil)
})()

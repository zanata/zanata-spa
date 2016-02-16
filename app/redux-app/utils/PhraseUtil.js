import {getStatusInfo} from './TransStatusService'
import _ from 'lodash'

const nullToEmpty = (value) => {
  return value || ''
}

export function getSaveButtonStatus (phrase) {
  if (hasNoTranslation(phrase)) {
    return getStatusInfo('untranslated')
  } else if (hasEmptyTranslation(phrase)) {
    return getStatusInfo('needswork')
  } else if (hasTranslationChanged(phrase)) {
    return getStatusInfo('translated')
  } else {
    return phrase.status
  }
}

export function hasTranslationChanged (phrase) {
  // on Firefox with input method turned on,
  // when hitting tab it seems to turn undefined value into ''
  var allSame = _.every(phrase.translations,
      function (translation, index) {
        return nullToEmpty(translation) ===
            nullToEmpty(phrase.newTranslations[index])
      })
  return !allSame
}

export function hasNoTranslation (phrase) {
  return _.isEmpty(_.compact(phrase.newTranslations))
}

export function hasEmptyTranslation (phrase) {
  return _.compact(phrase.newTranslations).length !==
      phrase.newTranslations.length
}

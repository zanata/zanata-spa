import { any, zip } from 'lodash'

function hasTranslationChanged (phrase) {
  // on Firefox with input method turned on,
  // when hitting tab it seems to turn undefined value into ''
  // so they are normalized to all be ''
  function changed ([original, current]) {
    return nullToEmpty(original) !== nullToEmpty(current)
  }

  const hasChanged = any(
    zip(phrase.translations, phrase.newTranslations),
    changed
  )
  return hasChanged
}

function nullToEmpty (value) {
  return value || ''
}

export { hasTranslationChanged }

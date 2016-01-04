import { any, compact, isEmpty, without, zip } from 'lodash'

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

/**
 * Get a string representing the status that should be
 * the selected status on the save button dropdown.
 *
 * Restricts the status to only valid values, based on
 * which translations are currently entered.
 */
function defaultSaveStatus (phrase) {
  if (hasNoTranslation(phrase)) {
    // only possible state is untranslated
    return 'untranslated'
  } else if (hasEmptyTranslation(phrase)) {
    return 'needswork'
  } else if (hasTranslationChanged(phrase)) {
    // TODO also need to handle 'approved' and 'rejected'
    //      when user is a reviewer and in review mode
    return 'translated'
  } else {
    // TODO when phrase status is a simple value,
    //      change to just return the simple value
    return phrase.status.ID
  }
}

function nonDefaultValidSaveStatuses (phrase) {
  const all = allValidSaveStatuses(phrase)
  return without(all, defaultSaveStatus(phrase))
}

/**
 * Get a list of all the translation status types
 * that would be valid to save the current new
 * translations of a phrase.
 */
function allValidSaveStatuses (phrase) {
  if (hasNoTranslation(phrase)) {
    // only possible state is untranslated
    return ['untranslated']
  } else if (hasEmptyTranslation(phrase)) {
    return ['needswork']
  } else {
    // TODO also need to handle 'approved' and 'rejected'
    //      when user is a reviewer and in review mode
    return ['translated', 'needswork']
  }
}

function hasEmptyTranslation (phrase) {
  return any(phrase.newTranslations, isEmpty)
}

function hasNoTranslation (phrase) {
  return isEmpty(compact(phrase.newTranslations))
}

function nullToEmpty (value) {
  return value || ''
}

export {
  defaultSaveStatus,
  hasTranslationChanged,
  nonDefaultValidSaveStatuses
}

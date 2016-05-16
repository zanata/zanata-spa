import { without } from 'lodash'
import {
  hasEmptyTranslation,
  hasNoTranslation,
  hasTranslationChanged } from './phrase'

/**
 * Get a string representing the status that should be
 * the selected status on the save button dropdown.
 *
 * Restricts the status to only valid values, based on
 * which translations are currently entered.
 */
export function defaultSaveStatus (phrase) {
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
    return phrase.status
  }
}

export function nonDefaultValidSaveStatuses (phrase) {
  const all = allValidSaveStatuses(phrase)
  return without(all, defaultSaveStatus(phrase))
}

/**
 * Get a list of all the translation statuses
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

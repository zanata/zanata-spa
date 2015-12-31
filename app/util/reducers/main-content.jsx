/* Reducer for all main content state
 *
 * This should be made part of the top level reducer when redux
 * is in charge of the whole app
 */

import React from 'react/addons'
import {
  SELECTED_LOCALE_CHANGED,
  SELECTED_TRANS_UNIT_CHANGED } from 'actions'

export default function (state, action) {
  console.log('handling', action, state)
  switch (action.type) {
    case SELECTED_LOCALE_CHANGED:
      return update({translationLocale: {$set: action.locale}})

    case SELECTED_TRANS_UNIT_CHANGED:
      return update({phrase: {$set: action.phrase}})

    default:
      console.warn('action was not handled (main-content)', action)
      return state
  }

  function update (commands) {
    return React.addons.update(state, commands)
  }
}

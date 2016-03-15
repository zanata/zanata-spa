import Combokeys from 'combokeys'
import globalBind from 'combokeys/plugins/global-bind'
import {SHORTCUTS} from '../actions/editorShortcuts'

import React from 'react'
import { connect } from 'react-redux'
// TODO import individual lodash functions that are used
import _ from 'lodash'

/**
 *
 * @param combokeys combokey for binding shortcuts
 * @param keyConfig must contain a 'keys' property with a value that is an array
 *        of shortcut keys. Optionally contain 'eventType' e.g. 'keyup'
 * @param handler key event handler
 */
const enableKeysFor = (combokeys, keyConfig, handler) => {
  // since our keys right now always works in textarea，
  // we always bind using global bind
  const {keys, eventType} = keyConfig

  if (!Array.isArray(keys)) {
    throw Error('keyConfig does not contain a "keys" value that is an array')
  }

  // TODO probably the same if undefined eventType is just passed in
  //      (conditional not needed)
  if (eventType) {
    combokeys.bindGlobal(keys, handler, eventType)
  } else {
    combokeys.bindGlobal(keys, handler)
  }
}

const deleteKeys = (combokeys, keyConfig) => {
  let {keys, eventType} = keyConfig
  combokeys.unbind(keys, eventType)
}

/**
 * called to set a 1 second timeout on the specified sequence
 *
 * this is so after each key press in the sequence you have 1 second
 * to press the next key before you have to start over
 *
 */
const sequenceKeyTimeout = 1000

/**
 * FIXME this looks like the wrong docs.
 * Header for navigation and control of the editor
 */
const ShortcutEnabledComponent = React.createClass({
  comboKeys: undefined,

  sequenceHandler (triggerKeyHandler, sequenceKeys, event) {
    triggerKeyHandler(event)
    sequenceKeys.forEach(sequenceKey => {
      const {keyConfig, handler} = sequenceKey
      const sequenceHandler = (event) => {
        deleteKeys(this.comboKeys, keyConfig)
        handler(event)
      }
      enableKeysFor(this.comboKeys, keyConfig, sequenceHandler)
      setTimeout(() => deleteKeys(this.comboKeys, keyConfig),
          sequenceKeyTimeout)
    })
  },

  componentDidMount () {
    const elem = this._shortcutContainer
    this.comboKeys = globalBind(new Combokeys(elem))
    if (elem) {
      this.props.shortcutInfoList.forEach(shortcutInfo => {
        const {keyConfig, handler} = shortcutInfo
        const sequenceKeys = keyConfig.sequenceKeys
        if (sequenceKeys) {
          enableKeysFor(this.comboKeys, keyConfig,
              _.curry(this.sequenceHandler)(handler, sequenceKeys))
        } else {
          enableKeysFor(this.comboKeys, keyConfig, handler)
        }
      })
    } else {
      // FIXME use a real error message
      console.error('==========WRONG')
    }
  },
  componentWillUnmount () {
    if (this.comboKeys) {
      this.comboKeys.detach()
    }
  },

  render: function () {
    // tabIndex is to make it focusable.
    // ref and the function is to set the element so that it can be referenced
    // once mounted.
    return (
      <div tabIndex="0" ref={(c) => this._shortcutContainer = c}>
        {this.props.children}
      </div>
    )
  }
})

// FIXME this takes the entire state but the component only uses a single part
const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  const shortcutInfoList = Object.keys(SHORTCUTS)
      .filter(key => {
        // shortcut key starts with _ means it's not a real key definition
        // this is a hack to make sequence key work
        return !key.startsWith('_')
      })
      .map(key => {
        const keyConfig = SHORTCUTS[key].keyConfig
        const sequenceKeys = keyConfig.sequenceKeys
        // if we have sequence key, add handler to use dispatch
        if (sequenceKeys) {
          sequenceKeys.forEach(sequenceKey => {
            sequenceKey.handler =
                (event) => dispatch(sequenceKey.keyAction(event))
          })
        }
        const handler = (event) => dispatch(SHORTCUTS[key].keyAction(event))
        return {
          keyConfig,
          handler
        }
      })
  return {
    shortcutInfoList
  }
}

export default connect(mapStateToProps, mapDispatchToProps
  )(ShortcutEnabledComponent)

import Combokeys from 'combokeys'
import globalBind from 'combokeys/plugins/global-bind'
import { SHORTCUTS } from '../actions/editorShortcuts'
import React from 'react'
import { connect } from 'react-redux'
import { map } from 'lodash'

/**
 * called to set a 1 second timeout on the specified sequence
 *
 * this is so after each key press in the sequence you have 1 second
 * to press the next key before you have to start over
 */
const sequenceKeyTimeout = 1000

const ShortcutEnabledComponent = React.createClass({
  combokeys: undefined,

  /**
   * Extend a handler to also register the next keys in the sequence.
   */
  makeSequenceHandler (handler, sequenceKeys) {
    return (event) => {
      handler(event)
      sequenceKeys.forEach(sequenceKey => {
        const { keyConfig, handler } = sequenceKey
        const sequenceHandler = (event) => {
          this.deleteKeys(keyConfig)
          handler(event)
        }
        this.enableKeysFor(keyConfig, sequenceHandler)
        // FIXME change to keep until sequence is completed or canceled
        setTimeout(() => this.deleteKeys(keyConfig),
        sequenceKeyTimeout)
      })
    }
  },

  enableKeysFor ({ keys, eventType }, handler) {
    if (!Array.isArray(keys)) {
      throw Error('keyConfig does not contain a "keys" value that is an array')
    }
    // Note: eventType may be undefined
    this.combokeys.bindGlobal(keys, handler, eventType)
  },

  deleteKeys ({ keys, eventType }) {
    this.combokeys.unbind(keys, eventType)
  },

  componentDidMount () {
    const elem = this.shortcutContainer
    this.combokeys = globalBind(new Combokeys(elem))
    if (elem) {
      this.props.shortcutInfoList.forEach(shortcutInfo => {
        const { keyConfig, handler } = shortcutInfo
        const sequenceKeys = keyConfig.sequenceKeys
        if (sequenceKeys) {
          this.enableKeysFor(keyConfig,
            this.makeSequenceHandler(handler, sequenceKeys))
        } else {
          this.enableKeysFor(keyConfig, handler)
        }
      })
    } else {
      console.error('No shortcut container element is bound for this ' +
                    'ShortcutEnabledComponent')
    }
  },

  componentWillUnmount () {
    if (this.combokeys) {
      this.combokeys.detach()
    }
  },

  render: function () {
    // tabIndex is to make it focusable.
    return (
      <div tabIndex="0" ref={(c) => this.shortcutContainer = c}>
        {this.props.children}
      </div>
    )
  }
})

const mapDispatchToProps = (dispatch) => {
  return {
    shortcutInfoList: map(SHORTCUTS, addHandlersRecursively)
  }

  function addHandlersRecursively (shortcut) {
    const { eventActionCreator } = shortcut
    const unhandledSequenceKeys = shortcut.keyConfig.sequenceKeys
    const sequenceKeys = unhandledSequenceKeys
      ? map(unhandledSequenceKeys, addHandlersRecursively)
      : undefined
    const keyConfig = { ...shortcut.keyConfig, sequenceKeys }
    const handler = (event) => {
      return dispatch(eventActionCreator(event))
    }
    return {
      keyConfig,
      handler
    }
  }
}

export default connect(undefined, mapDispatchToProps
  )(ShortcutEnabledComponent)

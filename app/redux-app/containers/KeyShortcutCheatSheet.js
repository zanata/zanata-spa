import { connect } from 'react-redux'
import CheatSheet from '../components/CheatSheet'
import React from 'react'
import KeyboardDefinition from '../components/KeyboardDefinitions'
import {toggleKeyboardShortcutsModal} from '../actions/headerActions'
import {SHORTCUTS, symbolizeKey} from '../actions/editorShortcuts'

function mapStateToProps (state, ownProps) {
  const showModal = state.ui.panels.keyShortcuts.visible
  const entries = Object.keys(SHORTCUTS).map((key) => {
    return SHORTCUTS[key]
  })
  const KeyboardDefFactory = React.createFactory(KeyboardDefinition)
  const entryMapFunc = (entry) => {
    const symbolizeKeys = entry.keyConfig.keys.map(symbolizeKey)
    return {
      definition: KeyboardDefFactory({keys: symbolizeKeys}),
      description: entry.description
    }
  }
  return {
    title: 'Keyboard Shortcuts',
    show: showModal,
    entries,
    entryMapFunc
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(toggleKeyboardShortcutsModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheatSheet)

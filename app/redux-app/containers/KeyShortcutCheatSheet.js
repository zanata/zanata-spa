import cx from 'classnames'
import Icon from '../components/Icon'
import KeyCombinations from '../components/KeyCombinations'
import { values } from 'lodash'
import { connect } from 'react-redux'
import React, { PropTypes } from 'react'
import { SHORTCUTS } from '../actions/editorShortcuts'
import { toggleKeyboardShortcutsModal } from '../actions/headerActions'

/**
 * Modal showing a summary of the available key shortcuts.
 */
const KeyShortcutCheatSheet = React.createClass({

  propTypes: {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string
  },

  renderShortcut (shortcut) {
    const { keys } = shortcut.keyConfig
    return (
      <li className="Grid" key={keys.join()}>
        <div className="Grid-cell u-size1of2 u-sPR-1-4 u-sPV-1-4 u-textRight">
          <KeyCombinations keys={keys}/>
        </div>
        <div className="Grid-cell u-size1of2 u-sPL-1-4 u-sPV-1-4">
          {shortcut.description}
        </div>
      </li>
    )
  },

  render () {
    const { onClose, show } = this.props
    const className = cx(this.props.className, 'Modal', {
      'is-active': show
    })

    // TODO string-i18n
    return (
        <div className={className}>
          <div className="Modal-dialog">
            <div className="Modal-header">
              <h2 className="Modal-title">Keyboard Shortcuts</h2>
              <button className="Modal-close Link Link--neutral"
                onClick={onClose}>
                <Icon name="cross" title="Close" />
              </button>
            </div>
            <div className="Modal-content u-sP-1">
              <ul>
                {values(SHORTCUTS).map(this.renderShortcut)}
              </ul>
            </div>
          </div>
        </div>
    )
  }
})

function mapStateToProps (state) {
  return {
    show: state.ui.panels.keyShortcuts.visible
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => {
      dispatch(toggleKeyboardShortcutsModal())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps
  )(KeyShortcutCheatSheet)

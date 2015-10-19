import cx from 'classnames'
import ControlsHeader from 'ControlsHeader'
import NavHeader from 'NavHeader'
import ProgressBar from 'ProgressBar'
import { connect } from 'react-redux'
import React from 'react'

/**
 * Header for navigation and control of the editor
 */
let EditorHeader = React.createClass({

  propTypes: {
    navHeaderVisible: React.PropTypes.bool.isRequired,
    counts: React.PropTypes.shape({
      total: React.PropTypes.number,
      approved: React.PropTypes.number,
      translated: React.PropTypes.number,
      needswork: React.PropTypes.number,
      untranslated: React.PropTypes.number
    })
  },

  render: function () {
    let className = cx('Header', 'Editor-header',
      { 'is-minimised': !this.props.navHeaderVisible })
    return (
      <header role="banner"
              className={className}
              focus-on="editor-header">
        <NavHeader/>
        <ControlsHeader/>
        <ProgressBar
          size="small"
          counts={this.props.counts}/>
      </header>
    )
  }
})

function selector (state) {
  return {
    navHeaderVisible: state.ui.panels.navHeader.visible,
    counts: state.data.context.selectedDoc.counts
  }
}

export default connect(selector)(EditorHeader)

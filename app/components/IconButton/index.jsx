import PlainIconButton from './PlainIconButton'
import React from 'react'

/**
 * Action button with an icon and title.
 */
let IconButton = React.createClass({

  propTypes: {
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool,
    className: React.PropTypes.string
  },

  getDefaultProps: () => {
    return {
      active: false,
      disabled: false
    }
  },

  render: function () {
    return (
      <PlainIconButton
        {...this.props}
        iconClass={this.props.className}
        buttonClass="Button Button--snug u-roundish Button--invisible"/>
    )
  }
})

export default IconButton

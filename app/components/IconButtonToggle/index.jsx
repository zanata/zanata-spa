import cx from 'classnames'
import IconButton from '../IconButton'
import React from 'react'

/**
 * An action button with an icon, title and background styling.
 *
 * Like IconButton but changes colour based on 'active' prop.
 *
 * props.className is applied to the icon
 */
let IconButtonToggle = React.createClass({

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
      active: false
    }
  },

  render: function () {
    let buttonClass = cx(this.props.buttonClass,
      'Button Button--snug u-roundish Button--invisible',
      { 'is-active': this.props.active })

    return (
      <IconButton
        {...this.props}
        iconClass={this.props.className}
        buttonClass={buttonClass}/>
    )
  }
})

export default IconButtonToggle

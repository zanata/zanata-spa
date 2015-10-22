import cx from 'classnames'
import Icon from '../Icon'
import React from 'react'

/**
 * Action button with an icon and title, unstyled.
 */
let IconButton = React.createClass({

  propTypes: {
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool,
    iconClass: React.PropTypes.string,
    buttonClass: React.PropTypes.string
  },

  getDefaultProps: () => {
    return {
      disabled: false
    }
  },

  render: function () {
    let buttonClass = cx(this.props.buttonClass,
      { 'is-disabled': this.props.disabled })

    let iconClass = cx('Icon--sm', this.props.iconClass)

    return (
      <button
        className={buttonClass}
        onClick={this.props.disabled ? undefined : this.props.onClick}
        title={this.props.title}>
        <Icon
          name={this.props.icon}
          title={this.props.title}
          className={iconClass}/>
      </button>
    )
  }
})

export default IconButton

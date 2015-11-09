import cx from 'classnames'
import Button from '../Button'
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

  render: function () {
    let iconClass = cx('Icon--sm', this.props.iconClass)

    return (
      <Button
        className={this.props.buttonClass}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        title={this.props.title}>
        <Icon
          name={this.props.icon}
          title={this.props.title}
          className={iconClass}/>
      </Button>
    )
  }
})

export default IconButton

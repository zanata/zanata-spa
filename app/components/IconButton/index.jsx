import cx from 'classnames'
import Icon from 'Icon'
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
    className: React.PropTypes.string
  },

  getDefaultProps: () => {
    return {
      active: false
    }
  },

  render: function () {
    let className = cx('Button Button--snug u-roundish Button--invisible',
      { 'is-active': this.props.active })

    let iconClassName = cx('Icon--sm', this.props.className)

    return (
      <button
        className={className}
        onClick={this.props.onClick}
        title={this.props.title}>
        <Icon
          name={this.props.icon}
          title={this.props.title}
          className={iconClassName}/>
      </button>
    )
  }
})

export default IconButton

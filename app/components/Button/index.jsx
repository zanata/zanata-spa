import cx from 'classnames'
import React from 'react'

/**
 * Button that can be disabled.
 */
let Button = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    onClick: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    className: React.PropTypes.string
  },

  getDefaultProps: () => {
    return {
      disabled: false
    }
  },

  render: function () {
    let className = cx(this.props.className,
      { 'is-disabled': this.props.disabled })

    return (
      <button
        className={className}
        disabled={this.props.disabled}
        onClick={this.props.disabled ? undefined : this.props.onClick}
        title={this.props.title}>
        {this.props.children}
      </button>
    )
  }
})

export default Button

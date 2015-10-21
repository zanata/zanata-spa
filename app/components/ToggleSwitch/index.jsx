import cx from 'classnames'
import React from 'react'

/**
 * Checkbox that appears as a slider-style switch
 */
let ToggleSwitch = React.createClass({

  propTypes: {
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    isChecked: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <span className={cx('Switch', this.props.className)}>
        <input className="Switch-checkbox"
               type="checkbox"
               id={this.props.id}
               checked={this.props.isChecked}
               onChange={this.props.onChange}/>
        <label className="Switch-label" htmlFor={this.props.id}>
          <span className="Switch-labelText">{this.props.label}</span>
        </label>
      </span>
    )
  }
})

export default ToggleSwitch

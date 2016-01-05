import cx from 'classnames'
import React, { PropTypes } from 'react'

/**
 * Dropdown with both an action button and a toggle button.
 */
let SplitDropdown = React.createClass({

  propTypes: {
    onToggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    enabled: PropTypes.bool,
    className: PropTypes.string,
    // passing as props is much less hassle than trying
    // to identify and work with child elements.
    actionButton: PropTypes.element.isRequired,
    toggleButton: PropTypes.element.isRequired,
    content: PropTypes.element.isRequired
  },

  getDefaultProps: () => {
    return {
      enabled: true
    }
  },

  toggleDropdown: function () {
    this.props.onToggle(this.refs.button.getDOMNode())
  },

  render: function () {
    let className = cx('Dropdown', this.props.className, {
      'is-active': this.props.isOpen
    })

    const buttonClick = this.props.enabled
        ? { onClick: this.toggleDropdown } : {}

    const toggleButton = (
      <div ref="button"
           className="Dropdown-toggle"
           aria-haspopup={true}
           aria-expanded={this.props.isOpen}
           {...buttonClick}>
        {this.props.toggleButton}
      </div>
    )
    return (
      <div className={className}>
        <div className="ButtonGroup ButtonGroup--hz
                        ButtonGroup--borderCollapse  ButtonGroup--round">
          <div className="ButtonGroup-item">
            {this.props.actionButton}
          </div>
          <div className="ButtonGroup-item">
            {toggleButton}
          </div>
        </div>
        <div className="Dropdown-content Dropdown-content--bordered">
          {this.props.content}
        </div>
      </div>
    )
  }
})

export default SplitDropdown

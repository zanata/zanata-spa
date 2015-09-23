import cx from 'classnames'
import React from 'react'

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
let Dropdown = React.createClass({

  propTypes: {
    onToggle: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    enabled: React.PropTypes.bool,
    className: React.PropTypes.string,

    children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
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
    let className = cx({
      'Dropdown': true,
      'is-active': this.props.isOpen
    }, this.props.className)

    var buttonCount = 0
    var contentCount = 0

    let children = React.Children.map(this.props.children, (child) => {
      if (child.type === Dropdown.Button) {
        buttonCount++
        // TODO should be ok just to assign onClick undefined
        let onClick = this.props.enabled
          ? { onClick: this.toggleDropdown } : {}
        return (
          <div ref="button"
               className="Dropdown-toggle"
               aria-haspopup={true}
               aria-expanded={this.props.isOpen}
               {...onClick}>
            {child}
          </div>
        )
      }
      if (child.type === Dropdown.Content) {
        contentCount++
        return child
      }
      throw Error('<Dropdown> can only contain <Dropdown.Button> and ' +
        '<Dropdown.Content> elements, but found <' + child.type + '>. ' +
        'Put the always-visible part in <Dropdown.Button> and the revealed ' +
        'part in <Dropdown.Content>')
    })

    if (buttonCount !== 1) {
      throw Error('<Dropdown> must contain exactly one <Dropdown.Button>, ' +
        ' but found ' + buttonCount)
    }
    if (contentCount !== 1) {
      throw Error('<Dropdown> must contain exactly one <Dropdown.Content>, ' +
        'but found ' + contentCount)
    }

    return (
      <div className={className}>
        {children}
      </div>
    )
  }
})

Dropdown.Button = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired
  },
  render: function () {
    // just unwrap the child and return it
    return React.Children.only(this.props.children)
  }
})

Dropdown.Content = React.createClass({
  render: function () {
    return (
      <div className="Dropdown-content Dropdown-content--bordered">
        {this.props.children}
      </div>
    )
  }
})

window.dropdownbutton = Dropdown.Button

export default Dropdown

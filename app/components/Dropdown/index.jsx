/* global React */

import cx from 'classnames'

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
let Dropdown = React.createClass({

  propTypes: {
    onToggle: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    enabled: React.PropTypes.bool,
    button: React.PropTypes.element.isRequired,
    className: React.PropTypes.string
  },

  getDefaultProps: () => {
    return {
      enabled: true
    };
  },

  toggleDropdown: function () {
    this.props.onToggle(this.refs.button.getDOMNode());
  },

  render: function() {
    let className = cx({
      'Dropdown': true,
      'is-active': this.props.isOpen
    }, this.props.className);

    let buttonProps = {
      ref: 'button',
      className: 'Dropdown-toggle',
      'aria-haspopup': true,
      'aria-expanded': this.props.isOpen
    };

    if (this.props.enabled) {
      buttonProps.onClick = this.toggleDropdown;
    }

    let button = React.addons.cloneWithProps(
      this.props.button, buttonProps);

    return (
      <div className={className}>
        {button}
        <div className="Dropdown-content Dropdown-content--bordered">
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default Dropdown

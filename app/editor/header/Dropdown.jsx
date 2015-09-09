/* global React, Dropdown */

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
Dropdown = React.createClass({

  propTypes: () => {
    return {
      onToggle: React.PropTypes.func.isRequired,
      isOpen: React.PropTypes.bool.isRequired,
      enabled: React.PropTypes.bool,
      button: React.PropTypes.element.isRequired,
      className: React.PropTypes.string
    };
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
    let cx = React.addons.classSet;
    let classes = cx({
      'Dropdown': true,
      'is-active': this.props.isOpen
    }) + ' ' + this.props.className;

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
      <div className={classes}>
        {button}
        <div className="Dropdown-content Dropdown-content--bordered">
          {this.props.children}
        </div>
      </div>
    );
  }
});

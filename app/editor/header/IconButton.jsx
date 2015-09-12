/* global React, IconButton, Icon */

/**
 * Action button with an icon and title.
 */
IconButton = React.createClass({

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
    };
  },

  render: function() {
    let classes = 'Button Button--snug u-roundish Button--invisible'
      + (this.props.active ? ' is-active' : '');

    let iconClasses = 'Icon--sm'
      + (this.props.className ? ' ' + this.props.className : '');

    return (
      <button
        className={classes}
        onClick={this.props.onClick}
        title={this.props.title}>
        <Icon
          name={this.props.icon}
          title={this.props.title}
          className={iconClasses}/>
      </button>
    );
  }
});

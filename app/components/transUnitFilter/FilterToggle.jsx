/* global React */

// FIXME put this one in components instead
import Icon from '../../editor/header/Icon.jsx'

/**
 * Styled checkbox to toggle a filter option on and off.
 */
let FilterToggle = React.createClass({

  propTypes: {
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    isChecked: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
    count: React.PropTypes.oneOfType([
      React.PropTypes.number,
      // FIXME stats API gives a string, change that to a number
      //       and remove this option.
      React.PropTypes.string
    ]),
    withDot: React.PropTypes.bool
  },

  getDefaultProps: () => {
    return {
      count: 0,
      withDot: true
    };
  },

  render: function() {
    let classes = 'Toggle u-round ' +
      (this.props.className ? this.props.className : '');

    let dot = this.props.withDot ?
      <Icon name="dot" className="Icon--xsm"/> : undefined;

    return (
      <div className={classes}>
        <input className="Toggle-checkbox"
               type="checkbox"
               id={this.props.id}
               checked={this.props.isChecked}
               onChange={this.props.onChange}/>
        <span className="Toggle-fakeCheckbox"/>
        <label className="Toggle-label"
               htmlFor={this.props.id}
               title={this.props.title}>
          {dot}
          {this.props.count}
          <span className="u-hiddenVisually">{this.props.title}</span>
        </label>
      </div>
    );
  }
});

export default FilterToggle

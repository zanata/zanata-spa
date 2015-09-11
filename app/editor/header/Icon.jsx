/* global React, Icon */

/**
 * Icon component, usually renders an svg icon
 */
Icon = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    title: React.PropTypes.node,
    className: React.PropTypes.string
  },

  render: function() {
    let titleMarkup = this.props.title ?
         '<title>' + this.props.title + '</title>' : '';

    // jsx does not understand xlink:href, so it is generated manually.
    // includes <title>since this is used as the full content of the svg tag
    let innerHtml = '<use xlink:href="#Icon-' + this.props.name +
                    '"/>' + titleMarkup;

    let classes = this.props.className ?
      this.props.className + ' Icon' : 'Icon';

    return (
      <div className={classes}>
        <svg className="Icon-item" dangerouslySetInnerHTML={{__html: innerHtml}} />
      </div>
    );
  }
});

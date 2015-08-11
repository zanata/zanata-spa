/* global React, ProjectVersionLink */

/**
 * Link to open the version page.
 * Label is project + version name
 */
ProjectVersionLink = React.createClass({
  getDefaultProps: function() {
    return {
      projectName: 'Loading ',
      versionName: 'Loading '
    }
  },

  render: function() {
    return (
      <a href={this.props.versionPageUrl}
         className="Link--invert Header-item u-inlineBlock">
        <span className="u-sPH-1-4 u-sizeWidth1 u-gtemd-hidden">
          <i className="i i--arrow-left"></i>
        </span>
        <span className="Editor-currentProject u-sm-hidden u-sML-1-2">
          <span>{this.props.projectName}</span> <span className="u-textMuted">{this.props.versionName}</span>
        </span>
      </a>)
  }
});

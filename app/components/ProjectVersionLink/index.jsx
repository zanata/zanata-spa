import React from 'react'

/**
 * Link to open the version page.
 * Label is project + version name
 */
let ProjectVersionLink = React.createClass({

  propTypes: {
    project: React.PropTypes.shape({
      name: React.PropTypes.string
    }).isRequired,
    version: React.PropTypes.string,
    url: React.PropTypes.string
  },

  getDefaultProps: () => {
    return {
      project: {
        name: 'Loading... '
      },
      versionSlug: 'Loading... '
    }
  },

  render: function () {
    return (
      <a href={this.props.url}
         className="Link--invert Header-item u-inlineBlock">
        <span className="u-sPH-1-4 u-sizeWidth1 u-gtemd-hidden">
          <i className="i i--arrow-left"></i>
        </span>
        <span className="Editor-currentProject u-sm-hidden u-sML-1-2">
          <span>{this.props.project.name}</span> <span
            className="u-textMuted">{this.props.version}</span>
        </span>
      </a>
    )
  }
})

export default ProjectVersionLink

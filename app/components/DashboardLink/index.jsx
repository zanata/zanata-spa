/**
 * Gravatar icon that links to the dashboard page
 */
let DashboardLink = React.createClass({

  propTypes: {
    dashboardUrl: React.PropTypes.string.isRequired,
    name: React.PropTypes.string,
    gravatarUrl: React.PropTypes.string
  },

  getDefaultProps: () => {
    return {
      // default "mystery man" icon
      gravatarUrl: 'http://www.gravatar.com/avatar/?d=mm'
    }
  },

  render: function () {
    return (
        <a href={this.props.dashboardUrl}
           className="u-sizeHeight-2 u-sizeWidth-1_1-2 u-inlineBlock"
           title={this.props.name}>
          <img className="u-round Header-avatar"
            src={this.props.gravatarUrl}/>
        </a>
    )
  }
})

export default DashboardLink

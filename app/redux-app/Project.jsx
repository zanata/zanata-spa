import React from 'react'
import { connect } from 'react-redux'

/**
 * Component to use when only project is specified
 */
class Project extends React.Component {
  render () {
    return (
      <div>
        <h1>{this.props.params.projectSlug}</h1>
        <p>Must specify a version in the URL.</p>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(Project)

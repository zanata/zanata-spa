import React from 'react'
import { connect } from 'react-redux'

/**
 * Top level of Zanata view hierarchy.
 */
class Zanata extends React.Component {
  render () {
    console.dir(this.props.location.pathname)
    return <p>{this.props.phrases}</p>
  }
}

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(Zanata)

import React from 'react'
import { connect } from 'react-redux'

// FIXME should probably get these actions imported from elsewhere instead
import { requestPhraseList } from './actions'

/**
 * Top level of Zanata view hierarchy.
 */
class Zanata extends React.Component {
  render () {
    // console.dir(this.props)
    return <div>
             Component
             <div onClick={this.props.requestPhraseList}>"Zanata"</div>
             . See console for props
           </div>
  }
}

function mapStateToProps (state) {
  // console.dir(state)
  return {} // { ...params }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { projectSlug, versionSlug, lang, docId } = ownProps.params
  return {
    requestPhraseList: () => {
      dispatch(requestPhraseList(projectSlug, versionSlug, lang, docId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Zanata)

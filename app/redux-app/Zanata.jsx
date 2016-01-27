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
    const phrases = this.props.phrases || []
    const phraseElements = phrases.map(({id, resId, status}, index) => {
      return <div key={index}>
        <table style={{border: '1px solid light gray'}}>
          <tbody>
            <tr>
              <td>index</td><td>{index}</td>
              <td>id</td><td>{id}</td>
              <td>resId</td><td>{resId}</td>
              <td>status</td><td>{status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    })

    return (
      <div>
        <div onClick={this.props.requestPhraseList}>"Click to get phrases"</div>
        {phraseElements}
      </div>

    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    phrases: state.phrases.inDoc[ownProps.params.docId]
  }
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

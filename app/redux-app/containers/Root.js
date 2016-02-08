import React from 'react'
import { connect } from 'react-redux'
import MainContent from './MainContent'
import ParamPropDispatcher from './ParamPropDispatcher'

// FIXME should probably get these actions imported from elsewhere instead
import {
  requestPhraseList,
  requestPhraseDetail
} from '../actions/phrases'

/**
 * Top level of Zanata view hierarchy.
 */
class Root extends React.Component {
  render () {
    return (
      // TODO adjust scrollbar width on the div, like in Angular template editor.html
      <ParamPropDispatcher {...this.props}>
        <div className="Editor is-suggestions-active">
          {/*
          */}
          <div onClick={this.props.requestPhraseList}>"Click to get phrases"</div>
          {/*
          <EditorHeader/>
          */}
          <MainContent/>
        </div>
      </ParamPropDispatcher>

    )
  }
}

function mapStateToProps (state, ownProps) {
  const flyweights = state.phrases.inDoc[ownProps.params.docId] || []
  const withDetail = flyweights.map(phrase => {
    return {...phrase, detail: state.phrases.detail[phrase.id]}
  })
  return {
    phrases: withDetail
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { projectSlug, versionSlug, lang, docId } = ownProps.params
  return {
    requestPhraseList: () => {
      dispatch(requestPhraseList(projectSlug, versionSlug, lang, docId))
    },
    requestPhraseDetail: (id) => {
      dispatch(requestPhraseDetail(lang, [id]))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)

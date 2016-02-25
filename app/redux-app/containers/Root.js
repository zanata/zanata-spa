import React from 'react'
import { connect } from 'react-redux'
import MainContent from './MainContent'
import ParamPropDispatcher from './ParamPropDispatcher'
import EditorHeader from './EditerHeader'
import KeyShortcutCheatSheet from './KeyShortcutCheatSheet'
import SuggestionsPanel from './SugguestionsPanel'

// FIXME should probably get these actions imported from elsewhere instead
import {
  requestPhraseList,
  requestPhraseDetail
} from '../actions/phrases'

import {fetchHeaderInfo, fetchUiLocales} from '../actions/headerActions'

/**
 * Top level of Zanata view hierarchy.
 */
class Root extends React.Component {
  componentDidMount () {
    this.props.requestUiLocales()
    this.props.requestHeaderInfo()
  }

  render () {
    return (
      // TODO adjust scrollbar width on the div, like in Angular template editor.html
      <ParamPropDispatcher {...this.props}>
        <div className="Editor is-suggestions-active">
          <EditorHeader/>
          <MainContent/>
          <KeyShortcutCheatSheet/>
          <SuggestionsPanel />
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
    // requestPhraseList: () => {
    //   dispatch(requestPhraseList(projectSlug, versionSlug, lang, docId))
    // },
    requestPhraseDetail: (id) => {
      dispatch(requestPhraseDetail(lang, [id]))
    },

    requestUiLocales: () => {
      dispatch(fetchUiLocales())
    },

    requestHeaderInfo: () => {
      dispatch(fetchHeaderInfo(projectSlug, versionSlug, docId, lang))
    }

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)

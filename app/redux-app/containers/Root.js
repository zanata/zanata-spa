import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import MainContent from './MainContent'
import ParamPropDispatcher from './ParamPropDispatcher'
import EditorHeader from './EditorHeader'
import KeyShortcutCheatSheet from './KeyShortcutCheatSheet'
import SuggestionsPanel from './SuggestionsPanel'
import { requestPhraseDetail } from '../actions/phrases'
import { fetchHeaderInfo, fetchUiLocales } from '../actions/headerActions'
import { saveSuggestionPanelHeight } from '../actions/suggestions'
import SplitPane from 'react-split-pane'

/**
 * Top level of Zanata view hierarchy.
 */
class Root extends Component {
  constructor () {
    super()
    // have to bind this for es6 classes until property initializers are
    // available in ES7
    this.resizeFinished = ::this.resizeFinished
    this.onWindowResize = ::this.onWindowResize
  }

  componentDidMount () {
    this.props.requestUiLocales()
    this.props.requestHeaderInfo()
    window.addEventListener('resize', this.onWindowResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize)
  }

  // TODO could debounce this
  onWindowResize (e) {
    // Reach in and override the dragged pixel size of the resizer component.
    // This is a workaround, needed because once the resizer is dragged, only
    // the size prop will override the dragged size, but specifying size prop
    // stops drag resize from working.
    if (this.refs && this.refs.suggestionResizer) {
      const pixelHeight = this.props.percentHeight * window.innerHeight
      this.refs.suggestionResizer.setState({
        draggedSize: pixelHeight
      })
      // trigger a re-render so the new panel size is shown properly
      this.forceUpdate()
    }
  }

  resizeFinished () {
    // draggedSize is defined as soon as any drag-resize happens,
    // so no need to save the height if it has not been set
    if (this.refs && this.refs.suggestionResizer &&
      this.refs.suggestionResizer.state.draggedSize) {
      const panelSize = this.refs.suggestionResizer.state.draggedSize
      this.props.saveSuggestionPanelHeight(panelSize)
    }
  }

  render () {
    const pixelHeight = this.props.percentHeight * window.innerHeight

    return (
      // TODO adjust scrollbar width on div like Angular template editor.html
      <ParamPropDispatcher {...this.props}>
        <div className="Editor is-suggestions-active">
          <EditorHeader/>
          <SplitPane ref="suggestionResizer"
            split="horizontal"
            defaultSize={pixelHeight}
            primary="second"
            onDragFinished={this.resizeFinished}>
            <MainContent/>
            <SuggestionsPanel />
          </SplitPane>
          <KeyShortcutCheatSheet/>
        </div>
      </ParamPropDispatcher>
    )
  }
}

Root.propTypes = {
  percentHeight: PropTypes.number.isRequired
}

function mapStateToProps (state, ownProps) {
  const { phrases, ui } = state
  const percentHeight = ui.panels.suggestions.heightPercent
  const flyweights = phrases.inDoc[ownProps.params.docId] || []
  const withDetail = flyweights.map(phrase => {
    return {...phrase, detail: phrases.detail[phrase.id]}
  })
  return {
    phrases: withDetail,
    percentHeight
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const { projectSlug, versionSlug, lang, docId } = ownProps.params
  return {
    saveSuggestionPanelHeight: (pixelHeight) => {
      const percent = pixelHeight / window.innerHeight
      dispatch(saveSuggestionPanelHeight(percent))
    },
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

import cx from 'classnames'
import React, { PropTypes } from 'react'
import Icon from '../components/Icon'
import TransUnit from '../components/TransUnit'
import ShortcutEnabledComponent from './ShortcutEnabledComponent'
import { connect } from 'react-redux'
import { getCurrentPagePhrasesFromState } from '../utils/filter-paging-util'

/**
 * Single row in the editor displaying a whole phrase.
 * Including source, translation, metadata and editing
 * facilities.
 */
const MainContent = React.createClass({

  propTypes: {
    maximised: PropTypes.bool.isRequired,
    phrases: PropTypes.arrayOf(PropTypes.object).isRequired,
    suggestionsOpen: PropTypes.bool.isRequired
  },

  render: function () {
    const { maximised, phrases, suggestionsOpen } = this.props

    if (phrases.length === 0) {
      // TODO translate "No content"
      return (
        <div className="u-posCenterCenter u-textEmpty u-textCenter">
          <Icon name="translate"
                className="Icon--lg Icon--circle u-sMB-1-4"/>
          <p>No content</p>
        </div>
      )
    }

    const transUnits = phrases.map((phrase, index) => {
      // FIXME maybe use phrase id, next page will have
      //       same index for different id. Not sure if
      //       that will matter though.

      // phrase is passed as a prop to avoid complexity of trying to get at
      // the phrase from state in mapDispatchToProps
      return (
        <li key={index}>
          <TransUnit index={index} phrase={phrase}/>
        </li>
      )
    })

    const className = cx('Editor-content TransUnit-container',
      { 'is-maximised': maximised })

      // FIXME use adjustable value of suggestion panel height instead of
      //       hard-coded value (when that is in state)
    const style = {
      bottom: suggestionsOpen ? '30%' : '0'
    }

    // TODO scrollbar width container+child were not brought over
    //      from the angular code yet.

    // Note: moved <ShortcutEnabledComponent> deeper in the hierarchy,
    //       make sure it still works that way
    // <main> is a top-level layout component, so it is not ok to wrap a div
    // around it as ShortcutEnabledComponent does.
    return (
      <main role="main"
        id="editor-content"
        className={className}
        style={style}>
        <div className="Editor-translationsWrapper">
          <ShortcutEnabledComponent>
            <ul className="Editor-translations">
              {transUnits}
            </ul>
          </ShortcutEnabledComponent>
        </div>
      </main>
    )
  }
})

function mapStateToProps (state, ownProps) {
  const minimalPhrases = getCurrentPagePhrasesFromState(state)
  const detailPhrases = minimalPhrases.map(phrase => {
    const detail = state.phrases.detail[phrase.id]
    return detail || phrase
  })
  const maximised = !state.ui.panels.navHeader.visible
  const suggestionsOpen = state.ui.panels.suggestions.visible

  return {
    context: state.context,
    maximised,
    phrases: detailPhrases,
    suggestionsOpen
  }
}

export default connect(mapStateToProps)(MainContent)

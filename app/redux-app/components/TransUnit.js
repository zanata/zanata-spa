import React, { PropTypes } from 'react'
import cx from 'classnames'
import TransUnitStatus from './TransUnitStatus'
import TransUnitSourcePanel from './TransUnitSourcePanel'
import TransUnitTranslationPanel from './TransUnitTranslationPanel'
import { connect } from 'react-redux'
import { isUndefined, pick } from 'lodash'
import { copyFromSource } from '../actions'

/**
 * Single row in the editor displaying a whole phrase.
 * Including source, translation, metadata and editing
 * facilities.
 */
const TransUnit = React.createClass({
  propTypes: {
    phrase: PropTypes.object.isRequired,
    selectPhrase: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isFirstPhrase: PropTypes.bool.isRequired,
    translationLocale: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    savingStatusId: PropTypes.oneOf([
      'untranslated',
      'needswork',
      'translated',
      'approved'
    ])
  },

  getInitialState: () => {
    return {
      saveDropdownKey: {}
    }
  },

  transUnitClassByStatus: {
    untranslated: 'TransUnit--neutral',
    needswork: 'TransUnit--unsure',
    translated: 'TransUnit--success',
    approved: 'TransUnit--highlight'
  },

  render: function () {
    const displayStatus = this.props.isSaving
      ? this.props.savingStatusId
      : this.props.phrase.status.ID

    const className = cx('TransUnit',
      this.transUnitClassByStatus[displayStatus],
      {
        'is-focused': this.props.selected,
        'is-first': this.props.isFirstPhrase
      })

    const phraseStatusProps = pick(this.props, [
      'isSaving',
      'phrase'
    ])

    const phraseSourcePanelProps = pick(this.props, [
      'cancelEdit',
      'copyFromSource',
      'phrase',
      'selected',
      'sourceLocale'
    ])

    const phraseTranslationPanelProps = pick(this.props, [
      'cancelEdit',
      'openDropdown',
      'phrase',
      'savePhraseWithStatus',
      'selected',
      'showSuggestions',
      'suggestionCount',
      'suggestionSearchType',
      'textChanged',
      'toggleDropdown',
      'toggleSuggestionPanel',
      'translationLocale',
      'undoEdit'
    ])

    return (
      <div className={className}
           onClick={this.props.selectPhrase.bind(undefined,
                      this.props.phrase.id)}>
        <TransUnitStatus {...phraseStatusProps}/>
        <TransUnitSourcePanel {...phraseSourcePanelProps}/>
        <TransUnitTranslationPanel {...phraseTranslationPanelProps}
          saveDropdownKey={this.state.saveDropdownKey}/>
      </div>
    )
  }
})

function mapStateToProps (state, ownProps) {
  const index = ownProps.index

  // this now contains an ordered list of phrases, and a map of detail for phrases
  console.dir(state.phrases)
  const phrase = state.phrases.inDoc[ownProps.docId][index]

  // FIXME need to track isSaving and savingStatusId
  //       per-phrase

  const passThroughProps = pick(state, [
    'openDropdown',
    'savePhraseWithStatus',
    'selectPhrase',
    'showSuggestions',
    'sourceLocale',
    'suggestionCount',
    'suggestionSearchType',
    'textChanged',
    'toggleDropdown',
    'toggleSuggestionPanel',
    'translationLocale'
  ])

  return {
    ...passThroughProps,
    copyFromSource: copyFromSource.bind(undefined, phrase.id),
    phrase,
    isFirstPhrase: index === 0,
    selected: state.selectedPhraseId === phrase.id,
    isSaving: !isUndefined(state.savingPhraseStatus[phrase.id]),
    savingStatusId: state.savingPhraseStatus[phrase.id],
    cancelEdit: state.cancelEdit.bind(undefined, phrase),
    undoEdit: state.undoEdit.bind(undefined, phrase)
  }
}

export default connect(mapStateToProps)(TransUnit)

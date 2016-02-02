import React, { PropTypes } from 'react'
import cx from 'classnames'
import TransUnitStatus from './TransUnitStatus'
import TransUnitSourcePanel from './TransUnitSourcePanel'
import TransUnitTranslationPanel from './TransUnitTranslationPanel'
import { connect } from 'react-redux'
import { isUndefined, pick } from 'lodash'
import { toggleDropdown } from '../actions'
import {
  cancelEdit,
  copyFromSource,
  selectPhrase,
  translationTextInputChanged,
  undoEdit
} from '../actions/phrases'

/**
 * Single row in the editor displaying a whole phrase.
 * Including source, translation, metadata and editing
 * facilities.
 */
const TransUnit = React.createClass({
  propTypes: {
    phrase: PropTypes.object.isRequired,
    selectPhrase: PropTypes.func.isRequired,
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
    const displayStatus = this.props.phrase.isSaving
      ? this.props.savingStatusId
      : this.props.phrase.status.ID

    const className = cx('TransUnit',
      this.transUnitClassByStatus[displayStatus],
      {
        'is-focused': this.props.selected,
        'is-first': this.props.isFirstPhrase
      })

    const phraseStatusProps = pick(this.props, [
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
        <TransUnitStatus phrase={this.props.phrase}/>
        <TransUnitSourcePanel {...phraseSourcePanelProps}/>
        <TransUnitTranslationPanel {...phraseTranslationPanelProps}
          saveDropdownKey={this.state.saveDropdownKey}/>
      </div>
    )
  }
})

function mapStateToProps (state, ownProps) {
  const index = ownProps.index
  const phrase = ownProps.phrase
  const sourceLocale = state.context.sourceLocale

  const passThroughProps = pick(state, [
    'openDropdown',
    'savePhraseWithStatus',
    'showSuggestions',
    'suggestionCount',
    'suggestionSearchType',
    'toggleSuggestionPanel',
    'translationLocale'
  ])

  return {
    ...passThroughProps,
    phrase,
    sourceLocale,
    isFirstPhrase: index === 0,
    selected: state.phrases.selectedPhraseId === phrase.id,
    savingStatusId: phrase.isSaving ? phrase.savingStatusId : undefined
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    cancelEdit: () => {
      dispatch(cancelEdit())
    },
    copyFromSource: () => {
      dispatch(copyFromSource(ownProps.phrase.id))
    },
    selectPhrase: () => {
      dispatch(selectPhrase(ownProps.phrase.id))
    },
    textChanged: (id, index, text) => {
      dispatch(translationTextInputChanged(id, index, text))
    },
    toggleDropdown: (key) => {
      dispatch(toggleDropdown(key))
    },
    undoEdit: () => {
      dispatch(undoEdit())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransUnit)

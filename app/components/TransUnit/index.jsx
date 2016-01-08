import React, { PropTypes } from 'react'
import cx from 'classnames'
import TransUnitStatus from '../TransUnitStatus'
import TransUnitSourcePanel from '../TransUnitSourcePanel'
import TransUnitTranslationPanel from '../TransUnitTranslationPanel'
import { connect } from 'react-redux'
import { pick } from 'lodash'

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

    savingStatusId: PropTypes.oneOf([
      'untranslated',
      'needswork',
      'translated',
      'approved'
    ])
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

    return (
      <div className={className}
           onClick={this.props.selectPhrase.bind(undefined, this.props.phrase)}>
        <TransUnitStatus {...phraseStatusProps}/>
        <TransUnitSourcePanel {...phraseSourcePanelProps}/>
        <TransUnitTranslationPanel {...this.props}/>
      </div>
    )
  }
})

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(TransUnit)

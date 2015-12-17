import React from 'react'
import { IntlMixin } from 'react-intl'
import SuggestionSources from '../SuggestionSources'
import SuggestionTranslations from '../SuggestionTranslations'
import { assign } from 'lodash'

/**
 * Display a single suggestion source, translation and metadata.
 */
let Suggestion = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    // true when the translation has just been copied
    suggestion: React.PropTypes.shape({
      copying: React.PropTypes.bool.isRequired,
      copySuggestion: React.PropTypes.func.isRequired,
      matchDetails: React.PropTypes.arrayOf(React.PropTypes.shape({
        type: React.PropTypes.oneOf(
          ['IMPORTED_TM', 'LOCAL_PROJECT']).isRequired,
        contentState: React.PropTypes.oneOf(['Translated', 'Approved'])
      })),
      similarityPercent: React.PropTypes.number,
      sourceContents: React.PropTypes.arrayOf(
        React.PropTypes.string).isRequired,
      targetContents: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    }),
    search: React.PropTypes.arrayOf(React.PropTypes.string),
    showDiff: React.PropTypes.bool.isRequired
  },

  /**
   * Calculate the match type for the suggestion
   */
  matchType: function (suggestion) {
    let topMatch = suggestion.matchDetails[0]

    if (topMatch.type === 'IMPORTED_TM') {
      return 'imported'
    }
    if (topMatch.type === 'LOCAL_PROJECT') {
      if (topMatch.contentState === 'Translated') {
        return 'translated'
      }
      if (topMatch.contentState === 'Approved') {
        return 'approved'
      }
    }
    console.error('Unable to generate row display type for top match')
  },

  matchTypeClass: {
    imported: 'TransUnit--secondary',
    translated: 'TransUnit--success',
    approved: 'TransUnit--highlight'
  },

  render: function () {
    const matchType = this.matchType(this.props.suggestion)
    const className = 'TransUnit TransUnit--suggestion ' +
                        this.matchTypeClass[matchType]
    const suggestion = assign({}, this.props.suggestion, {
      matchType: matchType
    })
    const props = assign({}, this.props, {
      suggestion: suggestion
    })

    return (
      <div
        className={className}>
        <div className="TransUnit-status"/>
        <SuggestionSources {...props}/>
        <SuggestionTranslations
          suggestion={suggestion}/>
      </div>
    )
  }
})

export default Suggestion

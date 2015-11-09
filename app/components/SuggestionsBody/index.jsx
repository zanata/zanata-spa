import Button from '../Button'
import React from 'react'
import SuggestionMatchPercent from '../SuggestionMatchPercent'

/**
 * Button that can be disabled.
 */
let SuggestionsBody = React.createClass({

  propTypes: {
    // true when the translation has just been copied
    copying: React.PropTypes.bool.isRequired,
    copySuggestion: React.PropTypes.func.isRequired,
    suggestion: React.PropTypes.shape({
      matchDetails: React.PropTypes.arrayOf(React.PropTypes.shape({
        type: React.PropTypes.string.isRequired,
        contentState: React.PropTypes.string
      })),
      similarityPercent: React.PropTypes.number
    })
  },

  getDefaultProps: () => {
    return {
      copying: false
    }
  },

  /**
   * Calculate the match type for the suggestion
   */
  matchType: function (suggestion) {
    var topMatch = suggestion.matchDetails[0]

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

  render: function () {
    let label = this.props.copying ? 'Copying' : 'Copy Translation'

    return (
      <div className="u-floatRight u-sm-floatNone">
        <ul className="u-listInline u-sizeLineHeight-1">
          <li>
            <SuggestionMatchPercent
              matchType={this.matchType(this.props.suggestion)}
              percent={this.props.suggestion.similarityPercent}/>
          </li>
          <li>
            <Button
              className="Button Button--small u-rounded Button--primary
                         u-sizeWidth-6"
              disabled={this.props.copying}
              onClick={this.props.copySuggestion}
              title={label}>
              {label}
            </Button>
          </li>
        </ul>
      </div>
    )
  }
})

export default SuggestionsBody

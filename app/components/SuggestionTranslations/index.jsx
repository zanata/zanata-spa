import React from 'react'
import { IntlMixin } from 'react-intl'
import SuggestionContents from '../SuggestionContents'
import SuggestionTranslationDetails from '../SuggestionTranslationDetails'

/**
 * Show all translations for a suggestion, with translation metadata.
 */
let SuggestionsTranslations = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    suggestion: React.PropTypes.shape({
      copying: React.PropTypes.bool.isRequired,
      copySuggestion: React.PropTypes.func.isRequired,
      matchType: React.PropTypes.string.isRequired,
      matchDetails: React.PropTypes.arrayOf(React.PropTypes.shape({
        type: React.PropTypes.string.isRequired,
        contentState: React.PropTypes.string
      })),
      similarityPercent: React.PropTypes.number,
      sourceContents: React.PropTypes.arrayOf(
        React.PropTypes.string).isRequired,
      targetContents: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    })
  },

  render: function () {
    return (
      <div className="TransUnit-panel TransUnit-translation u-sPV-1-2">
        <SuggestionContents
          plural={this.props.suggestion.sourceContents.length > 1}
          contents={this.props.suggestion.targetContents}/>
        <SuggestionTranslationDetails {... this.props}/>
      </div>
    )
  }
})

export default SuggestionsTranslations

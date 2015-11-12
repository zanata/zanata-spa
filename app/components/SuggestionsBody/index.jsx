import React from 'react'
import { IntlMixin } from 'react-intl'
import SuggestionContents from '../SuggestionContents'
import SuggestionTranslationDetails from '../SuggestionTranslationDetails'

/**
 * Button that can be disabled.
 */
let SuggestionsBody = React.createClass({
  mixins: [IntlMixin],

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

export default SuggestionsBody

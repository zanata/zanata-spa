import React, { PropTypes } from 'react'
import { IntlMixin } from 'react-intl'
import SuggestionContents from './SuggestionContents'
import SuggestionSourceDetails from './SuggestionSourceDetails'

/**
 * Display all the source strings for a suggestion, with
 * optional diff against a set of search strings.
 */
let SuggestionSources = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    suggestion: PropTypes.shape({
      matchDetails: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        contentState: PropTypes.string
      })),
      sourceContents: PropTypes.arrayOf(PropTypes.string).isRequired
    }),
    search: PropTypes.arrayOf(PropTypes.string),
    showDiff: PropTypes.bool.isRequired
  },

  render: function () {
    let sourceContents = this.props.suggestion.sourceContents
    let diffWith = this.props.showDiff ? this.props.search : undefined
    return (
      <div className="TransUnit-panel TransUnit-source">
        <SuggestionContents
          plural={sourceContents.length > 1}
          contents={sourceContents}
          compareTo={diffWith}/>
        <SuggestionSourceDetails
          suggestion={this.props.suggestion}/>
      </div>
    )
  }
})

export default SuggestionSources

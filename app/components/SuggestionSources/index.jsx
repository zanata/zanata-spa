import React from 'react'
import { IntlMixin } from 'react-intl'
import SuggestionContents from '../SuggestionContents'
import SuggestionSourceDetails from '../SuggestionSourceDetails'

/**
 * Display all the source strings for a suggestion, with
 * optional diff against a set of search strings.
 */
let SuggestionSources = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    suggestion: React.PropTypes.shape({
      matchDetails: React.PropTypes.arrayOf(React.PropTypes.shape({
        type: React.PropTypes.string.isRequired,
        contentState: React.PropTypes.string
      })),
      similarityPercent: React.PropTypes.number,
      sourceContents: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    }),
    search: React.PropTypes.arrayOf(React.PropTypes.string),
    showDiff: React.PropTypes.bool.isRequired
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
        <SuggestionSourceDetails {... this.props}/>
      </div>
    )
  }
})

export default SuggestionSources

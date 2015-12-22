import React, { PropTypes } from 'react'
import { IntlMixin } from 'react-intl'
import Suggestion from '../Suggestion'
import { pick } from 'lodash'

/**
 * Display all suggestions that match the current search.
 */
let SuggestionList = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    search: PropTypes.arrayOf(PropTypes.string),
    showDiff: PropTypes.bool.isRequired,

    suggestions: PropTypes.arrayOf(PropTypes.shape({
      // true when the translation has just been copied
      copying: PropTypes.bool.isRequired,
      copySuggestion: PropTypes.func.isRequired,
      suggestion: PropTypes.shape({
        matchDetails: PropTypes.arrayOf(PropTypes.shape({
          type: PropTypes.string.isRequired,
          contentState: PropTypes.string
        })),
        similarityPercent: PropTypes.number,
        sourceContents: PropTypes.arrayOf(
          PropTypes.string).isRequired,
        targetContents: PropTypes.arrayOf(
          PropTypes.string).isRequired
      })
    }))
  },

  render: function () {
    const sharedProps = pick(this.props,
      ['search', 'showDiff'])

    const suggestions = this.props.suggestions.map((suggestion, index) => {
      return <Suggestion key={index}
               suggestion={suggestion}
               {...sharedProps}/>
    })

    return (
      <div>
        {suggestions}
      </div>
    )
  }
})

export default SuggestionList


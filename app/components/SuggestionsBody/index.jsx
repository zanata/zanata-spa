import React from 'react'
import { IntlMixin } from 'react-intl'
import NoSuggestionsPanel from '../NoSuggestionsPanel'
import SuggestionList from '../SuggestionList'

/**
 * Display all suggestions that match the current search.
 */
let SuggestionsBody = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    search: React.PropTypes.arrayOf(React.PropTypes.string),
    showDiff: React.PropTypes.bool.isRequired,
    loading: React.PropTypes.bool.isRequired,
    searchInputFocused: React.PropTypes.bool.isRequired,
    tuSelected: React.PropTypes.bool.isRequired,
    isTextSearch: React.PropTypes.bool.isRequired,

    suggestions: React.PropTypes.arrayOf(React.PropTypes.shape({
      // true when the translation has just been copied
      copying: React.PropTypes.bool.isRequired,
      copySuggestion: React.PropTypes.func.isRequired,
      suggestion: React.PropTypes.shape({
        matchDetails: React.PropTypes.arrayOf(React.PropTypes.shape({
          type: React.PropTypes.string.isRequired,
          contentState: React.PropTypes.string
        })),
        similarityPercent: React.PropTypes.number,
        sourceContents: React.PropTypes.arrayOf(
          React.PropTypes.string).isRequired,
        targetContents: React.PropTypes.arrayOf(
          React.PropTypes.string).isRequired
      })
    }))
  },

  renderContent: function () {
    const hasSearch = this.props.search.length !== 0
    const hasSuggestions = this.props.suggestions.length !== 0

    if (this.props.loading) {
      return (
        <NoSuggestionsPanel
          icon="loader"
          message="Loading suggestions"/>
      )
    }

    if (hasSearch) {
      if (!hasSuggestions) {
        const noMatchingSuggestionMessage = this.props.isTextSearch
          ? 'No matching suggestions for the current search'
          : 'No matching suggestions for the currently selected phrase'
        return (
          <NoSuggestionsPanel
            icon="suggestions"
            message={noMatchingSuggestionMessage}/>
        )
      }
    } else {
      if (this.props.searchInputFocused || this.props.tuSelected) {
        return (
          <NoSuggestionsPanel
            icon="search"
            message="Enter a search term"/>
        )
      } else {
        return (
          <NoSuggestionsPanel
            icon="suggestions"
            message="Select a phrase or enter a search term"/>
        )
      }
    }

    return (
      <SuggestionList {...this.props}/>
    )
  },

  render: function () {
    return (
      <div className="Editor-suggestionsBody u-bgHigh">
        {this.renderContent()}
      </div>
    )
  }
})

export default SuggestionsBody

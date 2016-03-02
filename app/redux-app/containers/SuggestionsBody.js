import React, { PropTypes } from 'react'
import { IntlMixin } from 'react-intl'
import NoSuggestionsPanel from '../components/NoSuggestionsPanel'
import SuggestionList from '../components/SuggestionList'

/**
 * Display all suggestions that match the current search.
 */
let SuggestionsBody = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    searchType: PropTypes.oneOf(['phrase', 'text']).isRequired,
    search: PropTypes.shape({
      searchStrings: PropTypes.arrayOf(PropTypes.string),
      loading: PropTypes.bool.isRequired,
      input: PropTypes.shape({
        focused: PropTypes.bool.isRequired
      }).isRequired,
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
    }).isRequired,
    showDiff: PropTypes.bool.isRequired,
    transUnitSelected: PropTypes.bool.isRequired
  },

  renderContent: function () {
    const isTextSearch = this.props.searchType === 'text'
    const transUnitSelected = this.props.transUnitSelected
    const hasSearch = this.props.search.searchStrings.length !== 0
    const hasSuggestions = this.props.search.suggestions.length !== 0

    if (this.props.search.loading) {
      return (
        <NoSuggestionsPanel
          icon="loader"
          message="Loading suggestions"/>
      )
    }

    if (!hasSearch && !transUnitSelected) {
      return (
        <NoSuggestionsPanel
          icon="suggestions"
          message="Select a phrase or enter a search term"/>
      )
    }

    if (isTextSearch && !hasSearch) {
      return (
        <NoSuggestionsPanel
          icon="search"
          message="Enter a search term"/>
      )
    }

    if (hasSearch && !hasSuggestions) {
      const noMatchingSuggestionMessage = isTextSearch
        ? 'No matching suggestions for the current search'
        : 'No matching suggestions for the currently selected phrase'
      return (
        <NoSuggestionsPanel
          icon="suggestions"
          message={noMatchingSuggestionMessage}/>
      )
    }

    return (
      <SuggestionList
        search={this.props.search.searchStrings}
        showDiff={this.props.showDiff}
        suggestions={this.props.search.suggestions}/>
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

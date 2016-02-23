import cx from 'classnames'
import React, { PropTypes } from 'react'
import { IntlMixin } from 'react-intl'
import SuggestionsHeader from '../components/SuggestionsHeader'
import SuggestionsBody from '../components/SuggestionsBody'
import { assign, pick } from 'lodash'
import { connect } from 'react-redux'
import {toggleSuggestions} from '../actions/headerActions'

const DO_NOT_RENDER = null

/**
 * Panel to search for and display suggestions.
 */
let SuggestionsPanel = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    // likely want to move this switching to a higher level
    showPanel: PropTypes.bool.isRequired,
    searchType: PropTypes.oneOf(['phrase', 'text']).isRequired
  },

  render: function () {
    if (!this.props.showPanel) {
      return DO_NOT_RENDER
    }

    const className = cx('Editor-suggestions Editor-panel u-bgHigh', {
      'is-search-active': this.props.searchType === 'text'
    })

    const headerProps = pick(this.props, ['showDiff', 'onDiffChange',
      'closeSuggestions', 'search', 'transUnitSelected', 'searchType'])

    headerProps.search.toggle = this.props.searchToggle
    headerProps.search.clear = this.props.clearSearch
    headerProps.search.changeText = this.props.changeSearchText

    const bodyProps = pick(this.props, ['showDiff', 'transUnitSelected',
      'search', 'searchType'])

    return (
      <aside
        id="editor-suggestions"
        className={className}>
        <SuggestionsHeader {...headerProps}/>
        <SuggestionsBody {...bodyProps}/>
      </aside>
    )
  }
})

function mapStateToProps (state) {
  const suggestions = state.suggestions
  var search = suggestions.search
  if (suggestions.searchType === 'phrase') {
    if (suggestions.transUnitSelected) {
      search = assign({}, search, suggestions.phraseSearch)
    } else {
      // show no phrase search if no TU (phrase) is selected
      search = assign({}, search, {
        loading: false,
        searchStrings: [],
        suggestions: []
      })
    }
  } else if (suggestions.searchType === 'text') {
    search = assign({}, search, suggestions.textSearch)
  } else {
    console.error('invalid state.searchType', suggestions.searchType)
  }

  return assign({}, suggestions, {
    search: search,
    showPanel: state.ui.panels.suggestions.visible
  })
}

// TODO pahuang implement this
const diffChange = () => {
  return {type: 'DIFF_CHANGE'}
}
const toggleSearchType = () => {
  return {type: 'TOGGLE_SEARCH_TYPE'}
}
const clearSearch = () => {
  return {type: 'CLEAR_SEARCH'}
}
const changeSearchText = (text) => {
  return {type: 'CHANGE_SEARCH_TEXT', data: text}
}

function mapDispatchToProps (dispatch) {
  return {
    onDiffChange: () => dispatch(diffChange()),
    closeSuggestions: () => dispatch(toggleSuggestions()),
    searchToggle: () => dispatch(toggleSearchType()),
    clearSearch: () => dispatch(clearSearch()),
    changeSearchText: (text) => dispatch(changeSearchText(text))
  }
}

export default connect(mapStateToProps, mapDispatchToProps())(SuggestionsPanel)

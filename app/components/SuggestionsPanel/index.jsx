import cx from 'classnames'
import React, { PropTypes } from 'react'
import { IntlMixin } from 'react-intl'
import SuggestionsHeader from '../SuggestionsHeader'
import SuggestionsBody from '../SuggestionsBody'
import { assign, pick } from 'lodash'
import { connect } from 'react-redux'

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

function selector (state) {
  var search = state.search
  if (state.searchType === 'phrase') {
    if (state.transUnitSelected) {
      search = assign({}, search, state.phraseSearch)
    } else {
      // show no phrase search if no TU (phrase) is selected
      search = assign({}, search, {
        loading: false,
        searchStrings: [],
        suggestions: []
      })
    }
  } else if (state.searchType === 'text') {
    search = assign({}, search, state.textSearch)
  } else {
    console.error('invalid state.searchType', state.searchType)
  }

  return assign({}, state, {
    search: search
  })
}

export default connect(selector)(SuggestionsPanel)

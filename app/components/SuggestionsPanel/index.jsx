import cx from 'classnames'
import React from 'react'
import { IntlMixin } from 'react-intl'
import SuggestionsHeader from '../SuggestionsHeader'
import SuggestionsBody from '../SuggestionsBody'
import { pick } from 'lodash'

const DO_NOT_RENDER = null

/**
 * Panel to search for and display suggestions.
 */
let SuggestionsPanel = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    // likely want to move this switching to a higher level
    showPanel: React.PropTypes.bool.isRequired,
    showSearch: React.PropTypes.bool.isRequired
  },

  render: function () {
    if (!this.props.showPanel) {
      return DO_NOT_RENDER
    }

    const className = cx('Editor-suggestions Editor-panel u-bgHigh', {
      'is-search-active': this.props.showSearch
    })

    const headerProps = pick(this.props, ['showDiff', 'onDiffChange',
      'closeSuggestions', 'search', 'transUnitSelected'])

    const bodyProps = pick(this.props, ['showDiff', 'transUnitSelected',
      'suggestions'])

    return (
      <aside
        id="editor-suggestions"
        className={className}>
        <SuggestionsHeader
          {...headerProps}/>
        <SuggestionsBody
          {...bodyProps}
          search={this.props.search.strings}
          searchInputFocused={this.props.search.input.focused}
          loading={this.props.search.loading}
          isTextSearch={this.props.search.isTextSearch}/>
      </aside>
    )
  }
})

export default SuggestionsPanel

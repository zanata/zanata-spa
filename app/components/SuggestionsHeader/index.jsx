import React from 'react'
import ToggleSwitch from '../ToggleSwitch'
import IconButton from '../IconButton'
import PlainIconButton from '../IconButton/PlainIconButton'

/**
 * Header of the suggestions panel, with some controls and
 * the search input.
 */
let SuggestionsHeader = React.createClass({

  propTypes: {
    showDiff: React.PropTypes.bool.isRequired,
    onDiffChange: React.PropTypes.func.isRequired,
    showSearch: React.PropTypes.bool.isRequired,
    toggleSearch: React.PropTypes.func.isRequired,
    transUnitSelected: React.PropTypes.bool.isRequired,
    closeSuggestions: React.PropTypes.func.isRequired
  },

  render: function () {
    return (
      <ul className="u-listHorizontal u-textCenter">
      {/*
        <li className="u-smv-1-4">
          <a className="Link--neutral u-sizeHeight-1_1-2"
            title="Auto-fill" ng-click="suggestions.toggleAutofill()">
            (switch icon)
            Auto-fill
          </a>
        </li>
      */}
        <li className="u-sM-1-4">
          <ToggleSwitch
            id="difference-toggle"
            label="Difference"
            isChecked={this.props.showDiff}
            onChange={this.props.onDiffChange}/>
        </li>
        <li className="u-sM-1-8">

          <IconButton
            icon="search"
            title="Search suggestions"
            onClick={this.props.toggleSearch}
            active={this.props.showSearch}
            disabled={!this.props.transUnitSelected}/>
        </li>
        <li>
          <PlainIconButton
            icon="cross"
            title="Close suggestions"
            onClick={this.props.closeSuggestions}
            buttonClass="Link--neutral u-sizeHeight-1_1-2 u-sizeWidth-1_1-2"/>
        </li>
      </ul>
    )
  }
})

export default SuggestionsHeader

import React from 'react'
import Icon from '../Icon'
import IconButton from '../IconButton'
import IconButtonToggle from '../IconButtonToggle'
import SuggestionSearchInput from '../SuggestionSearchInput'
import ToggleSwitch from '../ToggleSwitch'

/**
 * Header of the suggestions panel, with some controls and
 * the search input.
 */
let SuggestionsHeader = React.createClass({

  propTypes: {
    showDiff: React.PropTypes.bool.isRequired,
    onDiffChange: React.PropTypes.func.isRequired,
    transUnitSelected: React.PropTypes.bool.isRequired,
    closeSuggestions: React.PropTypes.func.isRequired,
    search: React.PropTypes.shape({
      exists: React.PropTypes.bool.isRequired,
      text: React.PropTypes.string,
      loading: React.PropTypes.bool.isRequired,
      show: React.PropTypes.bool.isRequired,
      toggle: React.PropTypes.func.isRequired,
      resultCount: React.PropTypes.number,
      clear: React.PropTypes.func.isRequired,
      changeText: React.PropTypes.func.isRequired
    }).isRequired
  },

  getDefaultProps: () => {
    return {
      search: {
        text: ''
      }
    }
  },

  /**
   * Need to access refs to focus after the clear is complete
   */
  clearAndFocus: function () {
    this.props.search.clear()

    // FIXME this is racing with the Angular component.
    //       fix by either stopping that component doing any focus,
    //       or by making all the focus work on here.
    this.refs.searchInput.focusInput()
  },

  render: function () {
    const searchInput = this.props.search.show
      ? <div className="Editor-suggestionsSearch u-sPB-1-4">
          <SuggestionSearchInput
            ref="searchInput"
            text={this.props.search.text}
            loading={this.props.search.loading}
            hasSearch={this.props.search.exists}
            resultCount={this.props.search.resultCount}
            clearSearch={this.clearAndFocus}
            onTextChange={this.props.search.changeText}/>
        </div>
      : undefined

    return (
      <nav className="Editor-suggestionsHeader u-bgHighest u-sPH-3-4">
        <h2 className="Heading--panel u-sPV-1-4 u-floatLeft u-sizeHeight-1_1-2">
          <Icon name="suggestions"
            className="Icon--sm u-textMuted"/>
            Suggestions
        </h2>
        <div className="u-floatRight">
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

              <IconButtonToggle
                icon="search"
                title="Search suggestions"
                onClick={this.props.search.toggle}
                active={this.props.search.show}
                disabled={!this.props.transUnitSelected}/>
            </li>
            <li>
              <IconButton
                icon="cross"
                title="Close suggestions"
                onClick={this.props.closeSuggestions}
                buttonClass="Link--neutral u-sizeHeight-1_1-2 u-sizeWidth-1_1-2"
              />
            </li>
          </ul>
        </div>
        {searchInput}
      </nav>
    )
  }
})

export default SuggestionsHeader

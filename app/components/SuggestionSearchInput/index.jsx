import cx from 'classnames'
import Icon from '../Icon'
import IconButton from '../IconButton'
import React from 'react'

/**
 * Styled text input that displays result count.
 */
let SuggestionSearchInput = React.createClass({

  propTypes: {
    text: React.PropTypes.string.isRequired,
    onTextChange: React.PropTypes.func.isRequired,
    loading: React.PropTypes.bool.isRequired,
    resultCount: React.PropTypes.number,
    hasSearch: React.PropTypes.bool.isRequired,
    clearSearch: React.PropTypes.func.isRequired
  },

  clearSearch: function () {
    this.props.clearSearch()
    this.focusInput()
  },

  getDefaultProps: () => {
    return {
      focused: false
    }
  },

  getInitialState: () => {
    return {
      // FIXME one other component is interested in this state
      //       just deal with that when I get to it
      focused: false
    }
  },

  onFocus: function () {
    this.setState({
      focused: true
    })
  },

  onBlur: function () {
    this.setState({
      focused: false
    })
  },

  focusInput: function () {
    // TODO different approach for React 0.14

    // may not need to actually set focused=true, mainly using for
    // callback, which gets around issues with the component not being
    // properly in the DOM yet
    this.setState({
      focused: true
    }, () => {
      this.refs.input.getDOMNode().focus()
    })
  },

  render: function () {
    const resultCount = this.props.loading
      ? <span onClick={this.focusInput}
              className="Editor-suggestionsSearchLoader">
          {/* TODO proper loader */}
          Loading…
        </span>
      : this.props.hasSearch
        ? <span onClick={this.focusInput}
                className="Editor-suggestionsSearchResults">
            {this.props.resultCount} results
          </span>
        : undefined

    // FIXME need to not use Icon--sm style for this one
    //       maybe use a size property with default of small
    const clearButton = this.props.hasSearch
      ? <IconButton icon="cross"
                    title="Clear search"
                    iconClass="Icon--xsm"
                    onClick={this.clearSearch}/>
      : undefined

    return (
      <div className={cx('InputGroup InputGroup--outlined InputGroup--rounded',
                         { 'is-focused': this.state.focused })}>
        <span className="InputGroup-addon"
              onClick={this.focusInput}>
          <Icon name="search"
                title="Search suggestions"
                className="Icon--xsm"/>
        </span>
        <input ref="input"
               type="search"
               placeholder="Search suggestions…"
               maxLength="1000"
               value={this.props.text}
               onChange={this.props.onTextChange}
               className="InputGroup-input u-sizeLineHeight-1_1-4"/>
        <span className="InputGroup-addon">
          {resultCount}
        </span>
        <span className="InputGroup-addon">
          {clearButton}
        </span>
      </div>
    )
  }
})

export default SuggestionSearchInput

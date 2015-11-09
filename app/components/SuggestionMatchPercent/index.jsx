import React from 'react'

/**
 * Show a percentage for a match, styled for the match type.
 */
let SuggestionMatchPercent = React.createClass({

  propTypes: {
    // one of: imported, translated, approved
    matchType: React.PropTypes.string.isRequired,
    percent: React.PropTypes.number
  },

  percentageDisplayString: (percent) => {
    if (!isFinite(percent)) {
      return undefined
    }

    // Prevent very high percentages displaying as 100%
    if (percent > 99.99 && percent < 100) {
      return '99.99%'
    }
    if (percent >= 99.90 && percent < 100) {
      return '99.95'
    }

    // Limit any inexact percentages to a single decimal place
    if (Math.round(percent) !== percent) {
      return percent.toFixed(1) + '%'
    }

    return percent.toString() + '%'
  },

  displayClass: {
    imported: 'u-textSecondary',
    translated: 'u-textSuccess',
    approved: 'u-textHighlight'
  },

  render: function () {
    // FIXME output an <li> instead of a <div> when this is not wrapped
    // by angular
    return (
      <div className={this.displayClass[this.props.matchType]}>
        {this.percentageDisplayString(this.props.percent)}
      </div>
    )
  }
})

export default SuggestionMatchPercent

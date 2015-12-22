import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

/**
 * Heading that displays locale name and ID
 */
let TransUnitLocaleHeading = React.createClass({

  propTypes: {
    localeId: PropTypes.string.isRequired,
    localeName: PropTypes.string.isRequired
  },

  render: function () {
    const id = this.props.localeId
    const name = this.props.localeName

    return (
      <h3 className="TransUnit-heading">
        {name} <span className="u-textMuted u-textUpper">{id}</span>
      </h3>
    )
  }
})

function selector (state) {
  return state
}

export default connect(selector)(TransUnitLocaleHeading)

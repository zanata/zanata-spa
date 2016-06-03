import React, { PropTypes } from 'react'

/**
 * Heading that displays locale name and ID
 */
const TransUnitLocaleHeading = React.createClass({

  propTypes: {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  },

  render: function () {
    const id = this.props.id
    const name = this.props.name

    return (
      <h3 className="TransUnit-heading">
        {name} <span className="u-textMuted u-textUpper">{id}</span>
      </h3>
    )
  }
})

export default TransUnitLocaleHeading

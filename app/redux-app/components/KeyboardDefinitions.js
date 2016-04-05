import React, { PropTypes } from 'react'

let KeyboardDefinition = React.createClass({
  propTypes: {
    keys: PropTypes.arrayOf(PropTypes.string).isRequired
  },

  render () {
    const keyDefs = this.props.keys.map((key, index) => {
      return <kbd key={index}>{key}</kbd>
    })
    return (<span>{keyDefs}</span>)
  }
})

export default KeyboardDefinition

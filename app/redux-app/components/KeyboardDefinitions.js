import React, { PropTypes } from 'react'

let KeyboardDefinition = React.createClass({
  propTypes: {
    keys: PropTypes.arrayOf(PropTypes.string).isRequired
  },

  render () {
    const keysDef = this.props.keys.map((key, index) => {
      return <kbd key={index}>{key}</kbd>
    })
    return (<span>{keysDef}</span>)
  }
})

export default KeyboardDefinition
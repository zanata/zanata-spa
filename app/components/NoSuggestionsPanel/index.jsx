import React from 'react'
import Icon from '../Icon'
import { IntlMixin } from 'react-intl'

/**
 * Generic panel showing an icon and message, to
 * use when there are no suggestions to display.
 */
let NoSuggestionsPanel = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    message: React.PropTypes.string.isRequired,
    icon: React.PropTypes.oneOf(['loader', 'search', 'suggestions']).isRequired
  },

  render: function () {
    return (
      <div
        className="u-posCenterCenter u-textEmpty u-textCenter">
        <Icon
          name={this.props.icon}
          className="Icon--lg Icon--circle u-sMB-1-4"/>
        <p>{this.props.message}</p>
      </div>
    )
  }
})

export default NoSuggestionsPanel

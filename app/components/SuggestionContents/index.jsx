import React from 'react'
import { IntlMixin } from 'react-intl'

/**
 * Display all content strings (singular or plurals) for a suggestion.
 */
let SuggestionContents = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    plural: React.PropTypes.bool.isRequired,
    contents: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  },

  pluralFormLabel: function (index) {
    if (this.props.plural) {
      // FIXME translate the text. Either:
      //    - get it from Angular Gettext
      //    - use react-intl for it
      let text = index ? 'Plural Form' : 'Singular Form'
      return (
        <span className="u-textMeta">
          {text}
        </span>
      )
    }
  },

  render: function () {
    let contents = this.props.contents.map((content, index) => {
      return (
        <div key={index} className="TransUnit-item">
          <div className="TransUnit-itemHeader">
            {this.pluralFormLabel(index)}
          </div>
          <div>
            {content}
          </div>
        </div>
      )
    })

    return (
      <div>
        {contents}
      </div>
    )
  }
})

export default SuggestionContents

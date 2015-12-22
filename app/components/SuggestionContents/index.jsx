import TextDiff from '../TextDiff'
import React from 'react'
import { IntlMixin } from 'react-intl'
import cx from 'classnames'

/**
 * Display all content strings (singular or plurals) for a suggestion.
 * May show a diff against a set of provided strings.
 */
let SuggestionContents = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    plural: React.PropTypes.bool.isRequired,
    contents: React.PropTypes.arrayOf(
      React.PropTypes.string
    ).isRequired,
    // Include this to display a diff
    compareTo: React.PropTypes.arrayOf(
      React.PropTypes.string
    )
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

  /* Simple or diff content, depending whether props.compareTo
   * is present.
   */
  contentDiv: function (content, index) {
    const compareTo = this.props.compareTo
    const className = cx(
      'TransUnit-text',
      {
        'TransUnit-text--tight': !this.props.plural,
        'Difference': compareTo
      }
    )

    return compareTo
      ? <TextDiff
          className={className}
          text1={index >= compareTo.length ? '' : compareTo[index]}
          text2={content}/>
      : <div className={className}>
          {content}
        </div>
  },

  render: function () {
    const contents = this.props.contents.map((content, index) => {
      return (
        <div key={index} className="TransUnit-item">
          <div className="TransUnit-itemHeader">
            {this.pluralFormLabel(index)}
          </div>
          {this.contentDiv(content, index)}
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

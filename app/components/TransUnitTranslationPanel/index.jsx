import React, { PropTypes } from 'react'
import TransUnitTranslationHeader from '../TransUnitTranslationHeader'
import { connect } from 'react-redux'
import { pick } from 'lodash'

/**
 * Panel to display and edit transaltions of a phrase.
 */
let TransUnitTranslationPanel = React.createClass({

  propTypes: {
    selected: PropTypes.bool.isRequired,
    phrase: PropTypes.object.isRequired,
    cancelEdit: PropTypes.func.isRequired,
    undoEdit: PropTypes.func.isRequired,
    textChanged: PropTypes.func.isRequired,
    translationLocale: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  },

  render: function () {
    var header, footer
    const isPlural = this.props.phrase.plural

    if (this.props.selected) {
      const headerProps = pick(this.props, ['phrase', 'cancelEdit',
        'undoEdit', 'translationLocale'])
      header = <TransUnitTranslationHeader {...headerProps}/>
      
      /* TODO footer component
               from transUnit/translation/footer.html */

    }

    const translations = this.props.phrase.newTranslations.map(
      (translation, index) => {
        // TODO make this translatable
        const headerLabel = index === 0
          ? 'Singular Form'
          : 'Plural Form'

        const itemHeader = isPlural
          ? <div className="TransUnit-itemHeader">
              <span className="u-textMeta">
                {headerLabel}
              </span>
            </div>
          : undefined

        const onChange = this.props.textChanged
          .bind(undefined, this.props.phrase.id, index)

        return (
          <div className="TransUnit-item">
            {itemHeader}
          {/* TODO replace functionality of monospaced-elastic from
                   angular-elastic library
            possibly https://github.com/andreypopp/react-textarea-autosize */}
            {/* - check that it does not trim strings
                - translate "Enter a translation..."
              */}
            <textarea
              style={{border: '1px solid purple'}}
              className="TransUnit-text"
              rows="1"
              value={translation}
              placeholder="Enter a translation…"
              onChange={onChange}/>
          </div>
        )
      })
            // focus-on="phrase-{{phrase.id}}-{{$index}}"
            // ng-focus="transUnitCtrl.onTextAreaFocus(phrase, $index)"
            // ng-blur="transUnitCtrl.focused = false"
            // blur-on="phrase-{{phrase.id}}"

    return (
      <div className="TransUnit-panel TransUnit-translation">
        {header}
        {translations}
        {footer}

      </div>
    )
  }
})

function selector (state) {
  return state
}

export default connect(selector)(TransUnitTranslationPanel)

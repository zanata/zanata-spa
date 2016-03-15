import React, { PropTypes } from 'react'
import Textarea from 'react-textarea-autosize'
import TransUnitTranslationHeader from './TransUnitTranslationHeader'
import TransUnitTranslationFooter from './TransUnitTranslationFooter'
import Icon from './Icon'
import { pick } from 'lodash'

/**
 * Panel to display and edit transaltions of a phrase.
 */
const TransUnitTranslationPanel = React.createClass({

  propTypes: {
    selected: PropTypes.bool.isRequired,
    phrase: PropTypes.object.isRequired,
    savePhraseWithStatus: PropTypes.func.isRequired,
    cancelEdit: PropTypes.func.isRequired,
    undoEdit: PropTypes.func.isRequired,
    toggleDropdown: PropTypes.func.isRequired,
    textChanged: PropTypes.func.isRequired,
    translationLocale: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    suggestionCount: PropTypes.number.isRequired,
    showSuggestions: PropTypes.bool.isRequired,
    toggleSuggestionPanel: PropTypes.func.isRequired,
    suggestionSearchType: PropTypes.oneOf(['phrase', 'text']).isRequired
  },

  componentDidUpdate () {
    if (this.textarea && this.props.selected) {
      // FIXME replace focus-on-select without stealing suggestion search focus.
      // this.textarea.focus()
    }
  },

  render: function () {
    var header, footer
    const isPlural = this.props.phrase.plural

    if (this.props.selected) {
      const headerProps = pick(this.props, [
        'cancelEdit',
        'phrase',
        'translationLocale',
        'undoEdit'
      ])
      header = <TransUnitTranslationHeader {...headerProps}/>

      const footerProps = pick(this.props, [
        'openDropdown',
        'phrase',
        'saveDropdownKey',
        'savePhraseWithStatus',
        'showSuggestions',
        'suggestionCount',
        'suggestionSearchType',
        'toggleDropdown',
        'toggleSuggestionPanel'
      ])
      footer = <TransUnitTranslationFooter {...footerProps}/>
    }

    // TODO use dedicated phrase.isLoading variable when available
    const isLoading = !this.props.phrase.newTranslations

    let translations

    if (isLoading) {
      translations = <span className="u-textMeta">
                       <Icon name="loader"/>
                     </span>
    } else {
      const newTranslations = this.props.phrase.newTranslations
      ? this.props.phrase.newTranslations
      : ['Loading...']

      translations = newTranslations.map(
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
            <div className="TransUnit-item" key={index}>
              {itemHeader}
              {/* TODO check that this does not trim strings */}
              {/* TODO translate "Enter a translation..." */}
              <Textarea
                ref={(ref) => this.textarea = ref}
                className="TransUnit-text"
                rows={1}
                value={translation}
                placeholder="Enter a translation…"
                onChange={onChange}/>
            </div>
          )
        })
    }
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

export default TransUnitTranslationPanel

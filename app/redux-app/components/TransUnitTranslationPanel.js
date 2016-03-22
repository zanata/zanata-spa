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
    selectPhrasePluralIndex: PropTypes.func.isRequired,
    suggestionCount: PropTypes.number.isRequired,
    showSuggestions: PropTypes.bool.isRequired,
    toggleSuggestionPanel: PropTypes.func.isRequired,
    suggestionSearchType: PropTypes.oneOf(['phrase', 'text']).isRequired
  },

  componentWillMount () {
    // will be set by refs, initialize here to avoid need for null checks
    this.textareas = []
    // indicates when a textarea should be focused but was not rendered yet
    // so should focus as soon as the rendered textarea is available
    this.shouldFocus = false
  },

  componentDidMount () {
    const { selected, phrase } = this.props
    if (selected) {
      // this is the selected row, focus if the textarea is available
      // (should be available but in practice the ref is not set until later)
      const selectedIndex = phrase.selectedPluralIndex || 0
      const textarea = this.textareas[selectedIndex]
      if (textarea) {
        textarea.focus()
      } else {
        this.shouldFocus = true
      }
    }
  },

  componentDidUpdate (prevProps) {
    const becameSelected = this.props.selected && !prevProps.selected

    if (becameSelected || this.shouldFocus) {
      const selectedIndex = this.props.phrase.selectedPluralIndex || 0
      const textarea = this.textareas[selectedIndex]

      if (textarea) {
        textarea.focus()
        this.shouldFocus = false
      } else {
        this.shouldFocus = true
      }
    }
  },

  render: function () {
    const { phrase, selected } = this.props
    var header, footer
    const isPlural = this.props.phrase.plural

    if (selected) {
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
    const isLoading = !phrase.newTranslations
    const selectedPluralIndex = phrase.selectedPluralIndex || 0

    let translations

    if (isLoading) {
      translations = <span className="u-textMeta">
                       <Icon name="loader"/>
                     </span>
    } else {
      const newTranslations = phrase.newTranslations
      ? phrase.newTranslations
      : ['Loading...']

      translations = newTranslations.map(
        (translation, index) => {
          // TODO make this translatable
          const headerLabel = index === 0
           ? 'Singular Form'
           : 'Plural Form'

          const highlightHeader = selected && index === selectedPluralIndex
          const headerClass = highlightHeader
            ? 'u-textMini u-textPrimary'
            : 'u-textMeta'

          const itemHeader = isPlural
          ? <div className="TransUnit-itemHeader">
              <span className={headerClass}>
                {headerLabel}
              </span>
            </div>
          : undefined

          const onChange = this.props.textChanged
            .bind(undefined, phrase.id, index)

          const setFocusedPlural = this.props.selectPhrasePluralIndex
            .bind(undefined, phrase.id, index)

          return (
            <div className="TransUnit-item" key={index}>
              {itemHeader}
              {/* TODO check that this does not trim strings */}
              {/* TODO translate "Enter a translation..." */}
              <Textarea
                ref={(ref) => this.textareas[index] = ref}
                className="TransUnit-text"
                rows={1}
                value={translation}
                placeholder="Enter a translation…"
                onFocus={setFocusedPlural}
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

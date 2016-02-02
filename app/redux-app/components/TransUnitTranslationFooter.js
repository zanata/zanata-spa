import React, { PropTypes } from 'react'
import cx from 'classnames'
import Button from './Button'
import SplitDropdown from './SplitDropdown'
import Icon from './Icon'
import {
  defaultSaveStatus,
  hasTranslationChanged,
  nonDefaultValidSaveStatuses } from '../../util/zanata-tools/phrase'

/**
 * Footer for translation with save buttons and other action widgets.
 */
const TransUnitTranslationFooter = React.createClass({

  propTypes: {
    phrase: PropTypes.object.isRequired,
    suggestionCount: PropTypes.number.isRequired,
    toggleSuggestionPanel: PropTypes.func.isRequired,
    savePhraseWithStatus: PropTypes.func.isRequired,
    toggleDropdown: PropTypes.func.isRequired,
    saveDropdownKey: PropTypes.any.isRequired,
    openDropdown: PropTypes.any,
    showSuggestions: PropTypes.bool.isRequired,
    suggestionSearchType: PropTypes.oneOf(['phrase', 'text']).isRequired
  },

  buttonClassByStatus: {
    untranslated: 'Button--neutral',
    needswork: 'Button--unsure',
    translated: 'Button--success',
    approved: 'Button--highlight'
  },

  statusNames: {
    untranslated: 'Untranslated',
    needswork: 'Needs Work',
    translated: 'Translated',
    approved: 'Approved'
  },

  saveButtonElement: function (status) {
    const className = cx('Button u-sizeHeight-1_1-4',
                         'u-sizeFull u-textLeft',
                         this.buttonClassByStatus[status])

    const saveCallback = (event) => {
      this.props.savePhraseWithStatus(this.props.phrase, status, event)
    }

    return (
      <Button
        className={className}
        onClick={saveCallback}>
        {this.statusNames[status]}
      </Button>
    )
  },

  render: function () {
    const dropdownIsOpen =
      this.props.openDropdown === this.props.saveDropdownKey
    const translationHasChanged = hasTranslationChanged(this.props.phrase)

    var suggestionsIcon
    if (this.props.suggestionCount > 0) {
      const isPhraseSearchActive = this.props.showSuggestions &&
        this.props.suggestionSearchType === 'phrase'
      const iconClasses = cx('Button Button--snug Button--invisible u-roundish',
       { 'is-active': isPhraseSearchActive })

      suggestionsIcon = (
        <li>
          <Button
            className={iconClasses}
            title="Suggestions available"
            onClick={this.props.toggleSuggestionPanel}>
            <Icon name="suggestions"/>
            <span className="u-textMini">
              {this.props.suggestionCount}
            </span>
          </Button>
        </li>
      )
    }

    // TODO translate "Save as"
    const saveAsLabel = translationHasChanged
      ? <span className="u-textMeta u-sMR-1-4 u-floatLeft
                         u-sizeLineHeight-1_1-4">
            Save as
        </span>
      : undefined

    const status = defaultSaveStatus(this.props.phrase)

    const saveCallback = (event) => {
      this.props.savePhraseWithStatus(this.props.phrase, status, event)
    }
    const actionButton = (
        <Button
          className={cx('Button u-sizeHeight-1_1-4 u-textCapitalize',
                        this.buttonClassByStatus[status])}
          disabled={!translationHasChanged}
          title={this.statusNames[status]}
          onClick={saveCallback}>
          {this.statusNames[status]}
        </Button>
    )

    const otherStatuses = nonDefaultValidSaveStatuses(this.props.phrase)
    const otherActionButtons = otherStatuses.map((status, index) => {
      return (
        <li key={index}>
          {this.saveButtonElement(status)}
        </li>
      )
    })

    const dropdownToggleButton = otherStatuses.length > 0
      ? <Button
          className={cx('Button Button--snug u-sizeHeight-1_1-4',
                        'Dropdown-toggle',
                        this.buttonClassByStatus[status])}
          title="Save as…">
          <Icon name="chevron-down"
                title="Save as…"
                className="Icon--sm Dropdown-toggleIcon"/>
        </Button>
      : undefined

    const otherActionButtonList = (
      <ul className="Dropdown-content Dropdown-content--bordered
                     u-rounded">
        {otherActionButtons}
      </ul>
    )

    return (
      <div className="TransUnit-panelFooter u-cf
                      TransUnit-panelFooter--translation">
        <div className="TransUnit-panelFooterLeftNav u-floatLeft
                        u-sizeHeight-1_1-2">
          <ul className="u-listHorizontal">
{/* don't think this was ever displayed
            <li class="u-gtemd-hidden" ng-show="appCtrl.PRODUCTION">
              <button class="Link Link--neutral u-sizeHeight-1_1-2"
                title="{{::'Details'|translate}}">
                <icon name="info" title="{{::'Details'|translate}}"
                      class="u-sizeWidth-1_1-2"></icon>
              </button>
            </li>
*/}
            {suggestionsIcon}
          </ul>
        </div>
        <div className="u-floatRight">
          {saveAsLabel}
          <SplitDropdown
            onToggle={this.props.toggleDropdown.bind(undefined,
                        this.props.saveDropdownKey)}
            isOpen={dropdownIsOpen}
            actionButton={actionButton}
            toggleButton={dropdownToggleButton}
            content={otherActionButtonList}>
          </SplitDropdown>
        </div>
      </div>
    )
  }
})

export default TransUnitTranslationFooter

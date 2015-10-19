import { values } from 'lodash'
import Dropdown from '../Dropdown'
import React from 'react'

/**
 * Dropdown to select the language to display the user interface in.
 */
let UiLanguageDropdown = React.createClass({

  propTypes: {
    changeUiLocale: React.PropTypes.func.isRequired,
    selectedUiLocale: React.PropTypes.string,
    uiLocales: React.PropTypes.object.isRequired,

    toggleDropdown: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired
  },

  changeUiLocale: function (locale) {
    // AppCtrl expects { localeId, name } rather than { id, name }
    return () => this.props.changeUiLocale({
      localeId: locale.id,
      name: locale.name
    })
  },

  render: function () {
    let items = values(this.props.uiLocales).map(locale => {
      return (
        <li key={locale.id}>
          <a onClick={this.changeUiLocale(locale)}
             className="Dropdown-item">
            {locale.name}
          </a>
        </li>
      )
    })

    let selectedLocaleId = this.props.selectedUiLocale
    let selectedLocale = this.props.uiLocales[selectedLocaleId]
    let uiLocaleName = selectedLocale ? selectedLocale.name : selectedLocaleId

    return (
      <Dropdown onToggle={this.props.toggleDropdown}
                isOpen={this.props.isOpen}
                className="Dropdown--right u-sMV-1-2">
        <Dropdown.Button>
          <a className="Link--invert u-inlineBlock u-textNoWrap u-sPH-1-4">
            {uiLocaleName}
          </a>
        </Dropdown.Button>
        <Dropdown.Content>
          <ul>
            {items}
          </ul>
        </Dropdown.Content>
      </Dropdown>
    )
  }
})

export default UiLanguageDropdown

import { values } from 'lodash'
import { encode } from '../../../util/zanata-tools/doc-id'
import Dropdown from '../Dropdown'
import Icon from '../Icon'
import React, { PropTypes } from 'react'

/**
 * Dropdown to select the current language to translate to.
 */
let LanguagesDropdown = React.createClass({

  propTypes: {
    context: PropTypes.shape({
      projectVersion: PropTypes.shape({
        project: PropTypes.shape({
          slug: PropTypes.string
        }).isRequired,
        version: PropTypes.string.isRequired,
        locales: PropTypes.object.isRequired
      }).isRequired,
      selectedDoc: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired,
      selectedLocale: PropTypes.string.isRequired
    }).isRequired,

    toggleDropdown: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
  },

  localeUrl: function (locale) {
    let ctx = this.props.context
    let docId = encode(ctx.selectedDoc.id)
    let project = ctx.projectVersion.project.slug
    let version = ctx.projectVersion.version
    return '#/' + project + '/' + version + '/translate/' +
           docId + '/' + locale.id
  },

  render: function () {
    let locales = this.props.context.projectVersion.locales
    let items = values(locales).map(locale => {
      let url = this.localeUrl(locale)
      return (
        <li key={locale.id}>
          <a href={url} className="Dropdown-item">
            {locale.name}
          </a>
        </li>
      )
    })

    // sometimes name is not yet available, fall back on id
    let selectedLocaleId = this.props.context.selectedLocale
    let selectedLocale = locales[selectedLocaleId]
    let localeName = selectedLocale ? selectedLocale.name : selectedLocaleId

    return (
      <Dropdown onToggle={this.props.toggleDropdown}
                isOpen={this.props.isOpen}>
        <Dropdown.Button>
          <button className="Link--invert">
            {localeName}
            <Icon name="chevron-down"
                  className="Icon--sm Dropdown-toggleIcon u-sML-1-8"/>
          </button>
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

export default LanguagesDropdown

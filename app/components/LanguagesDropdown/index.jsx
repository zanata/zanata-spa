import { values } from 'lodash'
import { encode } from 'zanata-tools/doc-id'
import Dropdown from 'Dropdown'
import Icon from 'Icon'

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
let LanguagesDropdown = React.createClass({

  propTypes: {
    context: React.PropTypes.shape({
      projectVersion: React.PropTypes.shape({
        project: React.PropTypes.shape({
          slug: React.PropTypes.string
        }).isRequired,
        version: React.PropTypes.string.isRequired,
        locales: React.PropTypes.object.isRequired
      }).isRequired,
      selectedDoc: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
      }).isRequired,
      selectedLocale: React.PropTypes.string.isRequired
    }).isRequired,

    toggleDropdown: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired
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

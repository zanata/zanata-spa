import { encode } from 'zanata-tools/doc-id'
import Dropdown from 'Dropdown'
import Icon from 'Icon'

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
let DocsDropdown = React.createClass({

  propTypes: {
    editorContext: React.PropTypes.shape({
      projectSlug: React.PropTypes.string.isRequired,
      versionSlug: React.PropTypes.string.isRequired,
      docId: React.PropTypes.string.isRequired,
      localeId: React.PropTypes.string.isRequired
    }),

    toggleDropdown: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    allDocs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  },

  docUrl: function (docName) {
    if (this.props.editorContext) {
      let ctx = this.props.editorContext
      let encodedId = encode(docName)
      return '#/' + ctx.projectSlug + '/' + ctx.versionSlug + '/translate/' +
        encodedId + '/' + ctx.localeId
    }
  },

  render: function () {
    let items = this.props.allDocs.map(docName => {
      let url = this.docUrl(docName)
      return (
        <li key={docName}>
          <a href={url} className="Dropdown-item">{docName}</a>
        </li>
      )
    })

    let selectedDoc = this.props.editorContext
      ? this.props.editorContext.docId : undefined

    return (
      <Dropdown onToggle={this.props.toggleDropdown}
                isOpen={this.props.isOpen}>
        <Dropdown.Button>
          <button className="Link--invert">
            {selectedDoc}
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

export default DocsDropdown

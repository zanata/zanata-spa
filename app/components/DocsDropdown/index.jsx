import { encode } from 'zanata-tools/doc-id'
import Dropdown from 'Dropdown'
import Icon from 'Icon'
import React from 'react'

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
let DocsDropdown = React.createClass({

  propTypes: {
    context: React.PropTypes.shape({
      projectVersion: React.PropTypes.shape({
        project: React.PropTypes.shape({
          slug: React.PropTypes.string.isRequired
        }).isRequired,
        version: React.PropTypes.string.isRequired
      }).isRequired,
      selectedDoc: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
      }).isRequired,
      selectedLocale: React.PropTypes.string.isRequired
    }).isRequired,
    toggleDropdown: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired
  },

  docUrl: function (docId) {
    let ctx = this.props.context
    let project = ctx.projectVersion.project.slug
    let version = ctx.projectVersion.version
    let encodedId = encode(docId)
    return '#/' + project + '/' + version + '/translate/' +
      encodedId + '/' + ctx.selectedLocale
  },

  render: function () {
    let ctx = this.props.context
    let selectedDoc = ctx.selectedDoc.id
    let items = ctx.projectVersion.docs.map(docId => {
      let url = this.docUrl(docId)
      // TODO highlight selected
      return (
        <li key={docId}>
          <a href={url} className="Dropdown-item">{docId}</a>
        </li>
      )
    })

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

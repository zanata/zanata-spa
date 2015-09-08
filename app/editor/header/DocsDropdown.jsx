/* global React, DocsDropdown, Dropdown, Icon */

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
DocsDropdown = React.createClass({

  propTypes: {
    toggleDropdown: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    projectSlug: React.PropTypes.string.isRequired,
    versionSlug: React.PropTypes.string.isRequired,
    selectedDocId: React.PropTypes.string.isRequired,
    encodeDocId: React.PropTypes.func.isRequired,
    localeId: React.PropTypes.string.isRequired,
    allDocs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  },

  docUrl: function (docId) {
    let encodedId = this.props.encodeDocId(docId);
    return '#/' + this.props.projectSlug + '/' + this.props.versionSlug
        + '/translate/' + encodedId + '/' + this.props.localeId;
  },

  render: function() {
    let items = this.props.allDocs.map(docName => {
      let url = this.docUrl(docName);
      return (
        <li key={docName}>
          <a href={url} className="Dropdown-item">{docName}</a>
        </li>
      );
    });

    let toggleButton = (
      <button className="Link--invert">
        {this.props.selectedDocId} <Icon name="chevron-down"
              classes={['Icon--sm', 'Dropdown-toggleIcon']}/>
      </button>
    );

    return (
      <Dropdown button={toggleButton}
                onToggle={this.props.toggleDropdown}
                isOpen={this.props.isOpen}>
        <ul>
          {items}
        </ul>
      </Dropdown>
    );
  }
});

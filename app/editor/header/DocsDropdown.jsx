/* global React, DocsDropdown, Dropdown, Icon */

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
DocsDropdown = React.createClass({

  propTypes: {
    editorContext: React.PropTypes.shape({
      projectSlug: React.PropTypes.string.isRequired,
      versionSlug: React.PropTypes.string.isRequired,
      docId: React.PropTypes.string.isRequired,
      localeId: React.PropTypes.string.isRequired
    }),

    toggleDropdown: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired,
    encodeDocId: React.PropTypes.func.isRequired,
    allDocs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  },

  docUrl: function (docName) {
    if (this.props.editorContext) {
      let ctx = this.props.editorContext;
      let encodedId = this.props.encodeDocId(docName);
      return '#/' + ctx.projectSlug + '/' + ctx.versionSlug
          + '/translate/' + encodedId + '/' + ctx.localeId;
    }
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

    let selectedDoc = this.props.editorContext ?
      this.props.editorContext.docId : undefined;

    let toggleButton = (
      <button className="Link--invert">
        {selectedDoc} <Icon name="chevron-down"
              classes="Icon--sm Dropdown-toggleIcon"/>
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

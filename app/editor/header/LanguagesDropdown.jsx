/* global React, Dropdown */

import Dropdown from './Dropdown.jsx'
import Icon from './Icon.jsx'

/**
 * Dropdown component that wraps a toggle button and some content to toggle.
 */
let LanguagesDropdown = React.createClass({

  propTypes: {
    editorContext: React.PropTypes.shape({
      projectSlug: React.PropTypes.string.isRequired,
      versionSlug: React.PropTypes.string.isRequired
    }),
    locales: React.PropTypes.arrayOf(React.PropTypes.shape({
      localeId: React.PropTypes.string,
      name: React.PropTypes.string
    })),
    encodedDocId: React.PropTypes.string.isRequired,
    localeName: React.PropTypes.string.isRequired,
    toggleDropdown: React.PropTypes.func.isRequired,
    isOpen: React.PropTypes.bool.isRequired
  },

  localeUrl: function (locale) {
    return '#/' + this.props.projectSlug + '/' + this.props.versionSlug
        + '/translate/' + this.props.encodedDocId + '/' + locale.localeId;
  },

  render: function() {
    let items = this.props.locales.map(locale => {
      let url = this.localeUrl(locale);
      return (
        <li key={locale.localeId}>
          <a href={url} className="Dropdown-item">
            {locale.name}
          </a>
        </li>
      );
    });

    let toggleButton = (
      <button className="Link--invert">
        {this.props.localeName} <Icon name="chevron-down"
              className="Icon--sm Dropdown-toggleIcon"/>
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

export default LanguagesDropdown

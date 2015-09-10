/* global React, NavHeader, ProjectVersionLink, Icon,
   DashboardLink, DocsDropdown, LanguagesDropdown, UiLanguageDropdown, _ */

/**
 * Hideable navigation header across the top of the app.
 */
NavHeader = React.createClass({

  propTypes: {
    user: React.PropTypes.shape({
      name: React.PropTypes.string,
      gravatarUrl: React.PropTypes.string,
      dashboardUrl: React.PropTypes.string.isRequired
    }),

    editorContext: React.PropTypes.shape({
      projectSlug: React.PropTypes.string.isRequired,
      versionSlug: React.PropTypes.string.isRequired,
      docId: React.PropTypes.string.isRequired,
      localeId: React.PropTypes.string.isRequired
    }),

    projectName: React.PropTypes.string,
    versionPageUrl: React.PropTypes.string,
    encodeDocId: React.PropTypes.func.isRequired,
    encodedDocId: React.PropTypes.string.isRequired,
    allDocs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

    localeName: React.PropTypes.string.isRequired,
    locales: React.PropTypes.arrayOf(React.PropTypes.shape({
      localeId: React.PropTypes.string,
      name: React.PropTypes.string
    })),

    uiLocaleName: React.PropTypes.string,
    uiLocales: React.PropTypes.arrayOf(React.PropTypes.shape({
      localeId: React.PropTypes.string,
      name: React.PropTypes.string
    })).isRequired,

    changeUiLocale: React.PropTypes.func.isRequired,

    // takes dropdown key and button
    toggleDropdown: React.PropTypes.func.isRequired,
    // The key of the currently open dropdown
    openDropdown: React.PropTypes.any,
    docsDropdownKey: React.PropTypes.any.isRequired,
    localeDropdownKey: React.PropTypes.any.isRequired,
    uiLocaleDropdownKey: React.PropTypes.any.isRequired
  },

  render: function () {
    let ctx = this.props.editorContext;

    let projectVersionLinkProps = _.pick(this.props,
      ['projectName', 'versionPageUrl']);
    if (ctx) {
      projectVersionLinkProps.versionSlug = ctx.versionSlug;
    }

    let docsDropdownProps = _.pick(this.props,
      ['editorContext', 'encodeDocId', 'allDocs']);
    docsDropdownProps.isOpen = this.props.openDropdown ===
      this.props.docsDropdownKey;
    docsDropdownProps.toggleDropdown =
      this.props.toggleDropdown(this.props.docsDropdownKey);

    let langsDropdownProps = _.pick(this.props,
      ['editorContext', 'localeName', 'locales', 'encodedDocId']);
    langsDropdownProps.isOpen = this.props.openDropdown ===
      this.props.localeDropdownKey;
    langsDropdownProps.toggleDropdown =
      this.props.toggleDropdown(this.props.localeDropdownKey);

    let uiLangDropdownProps = _.pick(this.props,
      ['changeUiLocale', 'uiLocaleName', 'uiLocales']);
    uiLangDropdownProps.isOpen = this.props.openDropdown ===
      this.props.uiLocaleDropdownKey;
    uiLangDropdownProps.toggleDropdown =
      this.props.toggleDropdown(this.props.uiLocaleDropdownKey);

    return (
      <nav role="navigation"
           className="Editor-mainNav u-posRelative u-textCenter">
        <div className="u-posAbsoluteLeft">
          <ProjectVersionLink {...projectVersionLinkProps}/>
          <Icon name="chevron-right"
             classes="Icon--sm u-sMH-1-4 u-textInvert u-textMuted u-sm-hidden"/>
          <ul className="u-listInline u-inlineBlock">
            <li>
              <DocsDropdown {...docsDropdownProps}/>
            </li>
            <li>
              <LanguagesDropdown {...langsDropdownProps}/>
            </li>
          </ul>
        </div>

        <ul className="u-listHorizontal u-posAbsoluteRight u-sMR-1-2">
          <li>
            <UiLanguageDropdown {...uiLangDropdownProps}/>
          </li>
          <li>
            <DashboardLink {...this.props.user}/>
          </li>
        </ul>
      </nav>
    );
  }
});

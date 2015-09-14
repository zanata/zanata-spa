/* global React, _ */

import ControlsHeader from 'ControlsHeader'
import NavHeader from 'NavHeader'
import ProgressBar from 'ProgressBar'

/**
 * Header for navigation and control of the editor
 */
let EditorHeader = React.createClass({

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
    uiLocaleDropdownKey: React.PropTypes.any.isRequired,


    filterStatus: React.PropTypes.shape({
      all: React.PropTypes.bool.isRequired,
      approved: React.PropTypes.bool.isRequired,
      translated: React.PropTypes.bool.isRequired,
      needsWork: React.PropTypes.bool.isRequired,
      untranslated: React.PropTypes.bool.isRequired
    }).isRequired,

    // FIXME stats API gives strings, change those to numbers
    //       and remove the string option.
    counts: React.PropTypes.shape({
      // TODO better to derive total from the others rather than duplicate
      total: React.PropTypes.oneOfType(
        [React.PropTypes.number, React.PropTypes.string]),
      approved: React.PropTypes.oneOfType(
        [React.PropTypes.number, React.PropTypes.string]),
      translated: React.PropTypes.oneOfType(
        [React.PropTypes.number, React.PropTypes.string]),
      needswork: React.PropTypes.oneOfType(
        [React.PropTypes.number, React.PropTypes.string]),
      untranslated: React.PropTypes.oneOfType(
        [React.PropTypes.number, React.PropTypes.string ])
    }),

    // TODO replace with dispatched event
    resetFilter: React.PropTypes.func.isRequired,

    // TODO replace with dispatched event
    onFilterChange: React.PropTypes.func.isRequired,

    // FIXME combine these to an object
    pageNumber: React.PropTypes.number.isRequired,
    pageCount: React.PropTypes.number,
    firstPage: React.PropTypes.func.isRequired,
    previousPage: React.PropTypes.func.isRequired,
    nextPage: React.PropTypes.func.isRequired,
    lastPage: React.PropTypes.func.isRequired,

    toggleSuggestionPanel: React.PropTypes.func.isRequired,
    suggestionsVisible: React.PropTypes.bool.isRequired,

    toggleKeyboardShortcutsModal: React.PropTypes.func.isRequired,

    mainNavHidden: React.PropTypes.bool.isRequired,
    toggleMainNav: React.PropTypes.func.isRequired,

    // DO NOT RENAME, the translation string extractor looks specifically
    // for gettextCatalog.getString when generating the translation template.
    gettextCatalog: React.PropTypes.shape({
      getString: React.PropTypes.func.isRequired
    }).isRequired
  },

  render: function() {

    let classes = 'Header Editor-header'
        + (this.props.mainNavHidden ? ' is-minimised' : '');

    let navHeaderProps = _.pick(this.props, ['user', 'editorContext',
      'projectName', 'versionPageUrl', 'encodeDocId', 'encodedDocId',
      'allDocs', 'localeName', 'locales', 'uiLocaleName', 'uiLocales',
      'changeUiLocale', 'toggleDropdown', 'openDropdown', 'docsDropdownKey',
      'localeDropdownKey', 'uiLocaleDropdownKey']);

    let controlsHeaderProps = _.pick(this.props, ['filterStatus',
      'counts', 'resetFilter', 'onFilterChange', 'pageNumber', 'pageCount',
      'firstPage', 'previousPage', 'nextPage', 'lastPage',
      'toggleSuggestionPanel', 'suggestionsVisible',
      'toggleKeyboardShortcutsModal', 'mainNavHidden', 'toggleMainNav',
      'gettextCatalog']);

    return (
      <header role="banner"
              className={classes}
              focus-on="editor-header">
        <NavHeader {...navHeaderProps}/>
        <ControlsHeader {...controlsHeaderProps}/>
        <ProgressBar
          size="small"
          stats={this.props.counts}/>
      </header>
    );
  }
});

export default EditorHeader

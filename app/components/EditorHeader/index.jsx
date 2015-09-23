import { pick } from 'lodash'
import cx from 'classnames'
import ControlsHeader from 'ControlsHeader'
import NavHeader from 'NavHeader'
import ProgressBar from 'ProgressBar'
import { connect } from 'react-redux'
import React from 'react'

/**
 * Header for navigation and control of the editor
 */
let EditorHeader = React.createClass({

  propTypes: {

    // these can be removed when redux is wired up properly
    actions: React.PropTypes.shape({
      changeUiLocale: React.PropTypes.func.isRequired,
      toggleDropdown: React.PropTypes.func.isRequired,

      // these could go in a filtering action module
      resetFilter: React.PropTypes.func.isRequired,
      onFilterChange: React.PropTypes.func.isRequired,

      // these could go in a paging action module
      firstPage: React.PropTypes.func.isRequired,
      previousPage: React.PropTypes.func.isRequired,
      nextPage: React.PropTypes.func.isRequired,
      lastPage: React.PropTypes.func.isRequired,

      // these could go in a panel show/hide action module
      toggleSuggestionPanel: React.PropTypes.func.isRequired,
      toggleKeyboardShortcutsModal: React.PropTypes.func.isRequired,
      toggleMainNav: React.PropTypes.func.isRequired
    }).isRequired,

    // all business data, mirred from and synced to the server
    data: React.PropTypes.shape({
      user: React.PropTypes.shape({
        name: React.PropTypes.string,
        gravatarUrl: React.PropTypes.string,
        dashboardUrl: React.PropTypes.string.isRequired
      }).isRequired,
      context: React.PropTypes.shape({
        projectVersion: React.PropTypes.shape({
          project: React.PropTypes.shape({
            slug: React.PropTypes.string.isRequired,
            name: React.PropTypes.string
          }).isRequired,
          version: React.PropTypes.string.isRequired,
          url: React.PropTypes.string,
          docs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

          // localeId -> { id, name }
          locales: React.PropTypes.object.isRequired
        }).isRequired,
        selectedDoc: React.PropTypes.shape({
          id: React.PropTypes.string.isRequired,
          counts: React.PropTypes.shape({
            total: React.PropTypes.number,
            approved: React.PropTypes.number,
            translated: React.PropTypes.number,
            needswork: React.PropTypes.number,
            untranslated: React.PropTypes.number
          })
        }),
        selectedLocale: React.PropTypes.string
      }).isRequired
    }).isRequired,

    // current UI state, not represented on server
    ui: React.PropTypes.shape({
      panels: React.PropTypes.shape({
        suggestions: React.PropTypes.shape({
          visible: React.PropTypes.bool.isRequired
        }).isRequired,
        navHeader: React.PropTypes.shape({
          visible: React.PropTypes.bool.isRequired
        }).isRequired
      }).isRequired,
      // locale id for selected locale
      selectedUiLocale: React.PropTypes.string,
      // localeId -> { id, name }
      uiLocales: React.PropTypes.object.isRequired,

      // state for which dropdown is open
      dropdowns: React.PropTypes.shape({
        current: React.PropTypes.any,
        docsKey: React.PropTypes.any.isRequired,
        localeKey: React.PropTypes.any.isRequired,
        uiLocaleKey: React.PropTypes.any.isRequired
      }).isRequired,

      textFlowDisplay: React.PropTypes.shape({
        filter: React.PropTypes.shape({
          // FIXME should be able to derive this from the other 4
          all: React.PropTypes.bool.isRequired,
          approved: React.PropTypes.bool.isRequired,
          translated: React.PropTypes.bool.isRequired,
          needsWork: React.PropTypes.bool.isRequired,
          untranslated: React.PropTypes.bool.isRequired
        }).isRequired,
        // TODO derive this count per page and selected index
        pageNumber: React.PropTypes.number.isRequired,
        // TODO derive this from count per page and length of filtered textflows
        pageCount: React.PropTypes.number
      }).isRequired,
      gettextCatalog: React.PropTypes.shape({
        getString: React.PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  },

  render: function () {
    let className = cx('Header', 'Editor-header',
      { 'is-minimised': !this.props.ui.panels.navHeader.visible })

    let navHeaderProps = pick(this.props, ['actions', 'data', 'ui'])

    let controlsHeaderProps = pick(this.props, ['actions', 'ui'])
    controlsHeaderProps.counts = this.props.data.context.selectedDoc.counts

    return (
      <header role="banner"
              className={className}
              focus-on="editor-header">
        <NavHeader {...navHeaderProps}/>
        <ControlsHeader {...controlsHeaderProps}/>
        <ProgressBar
          size="small"
          counts={this.props.data.context.selectedDoc.counts}/>
      </header>
    )
  }
})

function selector (state) {
  return state
}

export default connect(selector)(EditorHeader)

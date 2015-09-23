import { pick } from 'lodash'
import cx from 'classnames'
import IconButton from 'IconButton'
import Pager from 'Pager'
import TranslatingIndicator from 'TranslatingIndicator'
import TransUnitFilter from 'TransUnitFilter'
import React from 'react'

/**
 * Header row with editor controls (filtering, paging, etc.)
 */
let ControlsHeader = React.createClass({

  propTypes: {
    actions: React.PropTypes.shape({
      resetFilter: React.PropTypes.func.isRequired,
      onFilterChange: React.PropTypes.func.isRequired,
      firstPage: React.PropTypes.func.isRequired,
      previousPage: React.PropTypes.func.isRequired,
      nextPage: React.PropTypes.func.isRequired,
      lastPage: React.PropTypes.func.isRequired,
      toggleSuggestionPanel: React.PropTypes.func.isRequired,
      toggleKeyboardShortcutsModal: React.PropTypes.func.isRequired,
      toggleMainNav: React.PropTypes.func.isRequired
    }).isRequired,

    ui: React.PropTypes.shape({
      panels: React.PropTypes.shape({
        suggestions: React.PropTypes.shape({
          visible: React.PropTypes.bool.isRequired
        }).isRequired
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
        pageNumber: React.PropTypes.number.isRequired,
        pageCount: React.PropTypes.number
      }).isRequired
    }).isRequired,

    counts: React.PropTypes.shape({
      // TODO better to derive total from the others rather than duplicate
      total: React.PropTypes.number,
      approved: React.PropTypes.number,
      translated: React.PropTypes.number,
      needswork: React.PropTypes.number,
      untranslated: React.PropTypes.number
    }),

    // DO NOT RENAME, the translation string extractor looks specifically
    // for gettextCatalog.getString when generating the translation template.
    gettextCatalog: React.PropTypes.shape({
      getString: React.PropTypes.func.isRequired
    }).isRequired
  },

  render: function () {
    let textFlowDisplay = this.props.ui.textFlowDisplay
    let gettextCatalog = this.props.gettextCatalog
    let transFilterProps = pick(this.props, ['actions',
      'counts', 'gettextCatalog'])
    transFilterProps.filter = textFlowDisplay.filter
    let pagerProps = pick(this.props, ['actions', 'gettextCatalog'])
    pagerProps.pageNumber = textFlowDisplay.pageNumber
    pagerProps.pageCount = textFlowDisplay.pageCount
    let navHeaderHidden = !this.props.ui.panels.navHeader.visible
    return (
      <nav className="u-bgHighest u-sPH-1-2 l--cf-of u-sizeHeight-1_1-2">
        <TranslatingIndicator gettextCatalog={gettextCatalog}/>
        <div className="u-floatLeft">
          <TransUnitFilter {...transFilterProps}/>
        </div>
        <div className="u-floatRight">
          <ul className="u-listHorizontal u-textCenter">
            <li className="u-sMV-1-4">
              <Pager {...pagerProps}/>
            </li>
            <li className="u-sM-1-8">
              <IconButton
                icon="suggestions"
                title={gettextCatalog.getString('Show suggestions panel')}
                onClick={this.props.actions.toggleSuggestionPanel}
                active={this.props.ui.panels.suggestions.visible}/>

            </li>
      {/* extra items from the angular template that were not being displayed
            <li ng-show="appCtrl.PRODUCTION">
              <button class="Link--neutral u-sizeHeight-1_1-2"
                title="{{'Details'|translate}}">
                <icon name="info" title="{{'Details'|translate}}"
                      class="u-sizeWidth-1_1-2"></icon>
              </button>
            </li>
            <li ng-show="appCtrl.PRODUCTION">
              <button class="Link--neutral u-sizeHeight-1_1-2"
              title="{{'Editor Settings'|translate}}">
                <icon name="settings" title="{{'Editor Settings'|translate}}"
                      class="u-sizeWidth-1_1-2"></icon>
              </button>
            </li>
      */}
            <li className="u-sm-hidden u-sM-1-8">
              <IconButton
                icon="keyboard"
                title={gettextCatalog.getString('Keyboard Shortcuts')}
                onClick={this.props.actions.toggleKeyboardShortcutsModal}/>
            </li>
            <li className="u-sM-1-8">
              <IconButton
                icon="chevron-up-double"
                title={navHeaderHidden
                  ? gettextCatalog.getString('Show Menubar')
                  : gettextCatalog.getString('Hide Menubar')}
                onClick={this.props.actions.toggleMainNav}
                active={navHeaderHidden}
                className={cx({'is-rotated': navHeaderHidden})}/>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
})

export default ControlsHeader

/* global React, ControlsHeader, TranslatingIndicator, TransUnitFilter,
   Pager, IconButton, _ */

/**
 * Header row with editor controls (filtering, paging, etc.)
 */
ControlsHeader = React.createClass({

  propTypes: {
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
    let transFilterProps = _.pick(this.props, ['filterStatus', 'counts',
      'resetFilter', 'onFilterChange', 'gettextCatalog']);

    let pagerProps = _.pick(this.props, ['pageNumber', 'pageCount',
      'firstPage', 'previousPage', 'nextPage', 'lastPage', 'gettextCatalog']);
    return (
      <nav className="u-bgHighest u-sPH-1-2 l--cf-of u-sizeHeight-1_1-2">
        <TranslatingIndicator gettextCatalog={this.props.gettextCatalog}/>
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
                title={this.props.gettextCatalog.getString('Show suggestions panel')}
                onClick={this.props.toggleSuggestionPanel}
                active={this.props.suggestionsVisible}/>

            </li>
      {/* Some extra items from the angular tempalte that were not being displayed
            <li ng-show="appCtrl.PRODUCTION">
              <button class="Link--neutral u-sizeHeight-1_1-2"
                title="{{'Details'|translate}}">
                <icon name="info" title="{{'Details'|translate}}" class="u-sizeWidth-1_1-2"></icon>
              </button>
            </li>
            <li ng-show="appCtrl.PRODUCTION">
              <button class="Link--neutral u-sizeHeight-1_1-2"
              title="{{'Editor Settings'|translate}}">
                <icon name="settings" title="{{'Editor Settings'|translate}}" class="u-sizeWidth-1_1-2"></icon>
              </button>
            </li>
      */}
            <li className="u-sm-hidden u-sM-1-8">
              <IconButton
                icon="keyboard"
                title={this.props.gettextCatalog.getString('Keyboard Shortcuts')}
                onClick={this.props.toggleKeyboardShortcutsModal}/>
            </li>
            <li className="u-sM-1-8">
              <IconButton
                icon="chevron-up-double"
                title={this.props.mainNavHidden
                  ? this.props.gettextCatalog.getString('Show Menubar')
                  : this.props.gettextCatalog.getString('Hide Menubar')}
                onClick={this.props.toggleMainNav}
                active={this.props.mainNavHidden}
                className={this.props.mainNavHidden ? 'is-rotated' : ''}/>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
});

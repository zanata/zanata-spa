/* global React, TransUnitFilter, FilterToggle */

/**
 * Panel with controls to filter the list of trans units
 */
TransUnitFilter = React.createClass({

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
    }).isRequired,

    // TODO replace with dispatched event
    resetFilter: React.PropTypes.func.isRequired,

    // TODO replace with dispatched event
    onFilterChange: React.PropTypes.func.isRequired,

    // DO NOT RENAME, the translation string extractor looks specifically
    // for gettextCatalog.getString when generating the translation template.
    gettextCatalog: React.PropTypes.shape({
      getString: React.PropTypes.func.isRequired
    }).isRequired
  },

  getDefaultProps: () => {
    return {
      counts: {
        total: 0,
        approved: 0,
        translated: 0,
        needswork: 0,
        untranslated: 0
      }
    };
  },

  render: function() {
    return (
      <ul className="u-listHorizontal u-sizeHeight-1">
        <li className="u-sm-hidden u-sMV-1-4">
          <FilterToggle
            id="filter-phrases-total"
            className="u-textSecondary"
            isChecked={this.props.filterStatus.all}
            onChange={this.props.resetFilter}
            title={this.props.gettextCatalog.getString('Total Phrases')}
            count={this.props.counts.total}
            withDot={false}/>
        </li>
        <li className="u-ltemd-hidden u-sMV-1-4">
          <FilterToggle
            id="filter-phrases-approved"
            className="u-textHighlight"
            isChecked={this.props.filterStatus.approved}
            onChange={this.props.onFilterChange.bind(undefined, 'approved')}
            title={this.props.gettextCatalog.getString('Approved')}
            count={this.props.counts.approved}/>
        </li>
        <li className="u-ltemd-hidden u-sMV-1-4">
          <FilterToggle
            id="filter-phrases-translated"
            className="u-textSuccess"
            isChecked={this.props.filterStatus.translated}
            onChange={this.props.onFilterChange.bind(undefined, 'translated')}
            title={this.props.gettextCatalog.getString('Translated')}
            count={this.props.counts.translated}/>
        </li>
        <li className="u-ltemd-hidden u-sMV-1-4">
          <FilterToggle
            id="filter-phrases-needs-work"
            className="u-textUnsure"
            isChecked={this.props.filterStatus.needsWork}
            onChange={this.props.onFilterChange.bind(undefined, 'needsWork')}
            title={this.props.gettextCatalog.getString('Needs Work')}
            count={this.props.counts.needswork}/>
        </li>
        <li className="u-ltemd-hidden u-sMV-1-4">
          <FilterToggle
            id="filter-phrases-untranslated"
            className="u-textNeutral"
            isChecked={this.props.filterStatus.untranslated}
            onChange={this.props.onFilterChange.bind(undefined, 'untranslated')}
            title={this.props.gettextCatalog.getString('Untranslated')}
            count={this.props.counts.untranslated}/>
        </li>
  {/* A couple of parts of the Angular template that were not being used yet
        <li ng-show="appCtrl.PRODUCTION" class="u-sML-1-4">
          <button class="Link--neutral u-sizeHeight-1_1-2"
            title="{{::'Filters'|translate}}">
            <icon name="filter" title="{{::'Filters'|translate}}"
              class="u-sizeWidth-1_1-2"></icon>
          </button>
        </li>
        <li ng-show="appCtrl.PRODUCTION">
          <button class="Link--neutral u-sizeHeight-1_1-2"
            title="{{::'Search'|translate}}">
            <icon name="search" title="{{::'Search'|translate}}"
              class="u-sizeWidth-1_1-2"></icon>
          </button>
        </li>
  */}

      </ul>
    );
  }
});

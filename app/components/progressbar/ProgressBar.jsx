/* global React, _ */

/**
 * Bar showing translation progress
 */
let ProgressBar = React.createClass({

  propTypes: {
    size: React.PropTypes.string,

    // FIXME stats API gives strings, change those to numbers
    //       and remove the string option.
    stats: React.PropTypes.shape({
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
    }).isRequired
  },

  getDefaultProps: () => {
    return {
      stats: {
        total: 0,
        approved: 0,
        translated: 0,
        needswork: 0,
        untranslated: 0
      }
    };
  },

  ProgressItem: React.createClass({
    propTypes: {
      state: React.PropTypes.string.isRequired,
      start: React.PropTypes.number.isRequired,
      width: React.PropTypes.number.isRequired
    },
    render: function () {
      let classes = 'Progressbar-item Progressbar-' + this.props.state;
      let style = {
        marginLeft: this.props.start + '%',
        width: this.props.width + '%'
      };
      return (
        <span className={classes}
          style={style}/>
      );
    }
  }),

  render: function() {
    let ProgressItem = this.ProgressItem;
    let classes = 'Progressbar'
      + (this.props.size === 'small' ? ' Progressbar--sm' : '')
      + (this.props.size === 'large' ? ' Progressbar--lg' : '');
    let stats = this.props.stats;

    let total = parseFloat(stats.total);
    let widths = _.chain(stats)
      .pick(['approved', 'translated', 'needswork', 'untranslated'])
      .mapValues((count) => {
        return count ? 100 * parseFloat(count) / total : 0;
      })
      .value();

    var starts = {
      approved: 0,
      translated: widths.approved
    };
    starts.needswork = starts.translated + widths.translated;
    starts.untranslated = starts.needswork + widths.needswork;

    return (
      <div className={classes}>
        <ProgressItem
          state="approved"
          start={starts.approved}
          width={widths.approved}/>
        <ProgressItem
          state="translated"
          start={starts.translated}
          width={widths.translated}/>
        <ProgressItem
          state="needsWork"
          start={starts.needswork}
          width={widths.needswork}/>
        <ProgressItem
          state="untranslated"
          start={starts.untranslated}
          width={widths.untranslated}/>
      </div>
    );
  }
});

export default ProgressBar

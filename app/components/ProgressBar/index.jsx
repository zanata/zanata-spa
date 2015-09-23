import { chain } from 'lodash'
import cx from 'classnames'
import React from 'react'

/**
 * Bar showing translation progress
 */
let ProgressBar = React.createClass({

  propTypes: {
    size: React.PropTypes.string,
    counts: React.PropTypes.shape({
      // TODO better to derive total from the others rather than duplicate
      total: React.PropTypes.number,
      approved: React.PropTypes.number,
      translated: React.PropTypes.number,
      needswork: React.PropTypes.number,
      untranslated: React.PropTypes.number
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
    }
  },

  ProgressItem: React.createClass({
    propTypes: {
      state: React.PropTypes.string.isRequired,
      start: React.PropTypes.number.isRequired,
      width: React.PropTypes.number.isRequired
    },
    render: function () {
      let className = cx('Progressbar-item', 'Progressbar-' + this.props.state)
      let style = {
        marginLeft: this.props.start + '%',
        width: this.props.width + '%'
      }
      return (
        <span className={className}
          style={style}/>
      )
    }
  }),

  render: function () {
    let ProgressItem = this.ProgressItem
    let className = cx('Progressbar', {
      'Progressbar--sm': this.props.size === 'small',
      'Progressbar--lg': this.props.size === 'large'
    })

    let counts = this.props.counts

    let total = parseFloat(counts.total)
    let widths = chain(counts)
      .pick(['approved', 'translated', 'needswork', 'untranslated'])
      .mapValues((count) => {
        return count ? 100 * parseFloat(count) / total : 0
      })
      .value()

    var starts = {
      approved: 0,
      translated: widths.approved
    }
    starts.needswork = starts.translated + widths.translated
    starts.untranslated = starts.needswork + widths.needswork

    return (
      <div className={className}>
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
    )
  }
})

export default ProgressBar

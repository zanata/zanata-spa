import cx from 'classnames'
import React, { PropTypes } from 'react'
import {compose} from 'lodash'

let CheatSheet = React.createClass({

  propTypes: {
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    entries: PropTypes.arrayOf(PropTypes.object).isRequired,
    entryMapFunc: PropTypes.func,
    className: PropTypes.string
  },

  displayFunc (item) {
    const {definition, description} = item
    if (!definition || !description) {
      throw new Error('props.entryMapFunc should map props.entries into a ' +
          'list of object with shape ' +
          '{definition:' +
          ' PropTypes.oneOfType([PropTypes.element, PropTypes.string],' +
          ' description: PropTypes.string')
    }

    const key = definition.props.keys.join()
    return (
        <li className="Grid" key={key}>
          <div className="Grid-cell u-size1of2 u-sPR-1-4
                    u-sPV-1-4 u-textRight">
            {definition}
          </div>
          <div className="Grid-cell u-size1of2 u-sPL-1-4
                     u-sPV-1-4">
            {description}
          </div>
        </li>
    )
  },

  render () {
    const isActive = this.props.show
    const className = cx(this.props.className, 'Modal', {
      'is-active': isActive
    })

    const items = this.props.entries
        .map(compose(this.displayFunc, this.props.entryMapFunc))

    return (
        <div className={className}>
          <div className="Modal-dialog">
            <div className="Modal-header">
              <h2 className="Modal-title">{this.props.title}</h2>
              <button className="Modal-close Link Link--neutral"
                      onClick={this.props.onClose}>
                <icon name="cross" title="Close" />
              </button>
            </div>
            <div className="Modal-content u-sP-1">
              <ul>
                {items}
              </ul>
            </div>
          </div>
        </div>
    )
  }
})

export default CheatSheet

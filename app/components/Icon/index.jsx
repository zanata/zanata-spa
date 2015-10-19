import cx from 'classnames'
import React from 'react'

/**
 * Icon component, usually renders an svg icon
 */
let Icon = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    title: React.PropTypes.node,
    className: React.PropTypes.string
  },

  render: function () {
    let titleMarkup = this.props.title
      ? '<title>' + this.props.title + '</title>'
      : ''

    // jsx does not understand xlink:href, so it is generated manually.
    // includes <title>since this is used as the full content of the svg tag
    let innerHtml = '<use xlink:href="#Icon-' + this.props.name +
                    '"/>' + titleMarkup

    let className = cx(this.props.className, 'Icon')

    return (
      <div className={className}>
        <svg className="Icon-item"
             dangerouslySetInnerHTML={{__html: innerHtml}} />
      </div>
    )
  }
})

export default Icon

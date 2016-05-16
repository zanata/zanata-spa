import Icon from './Icon'
import React, { PropTypes } from 'react'

/**
 * Paging buttons and current-page indicator.
 */

let PagerButton = React.createClass({
  render: function () {
    return (
        <li>
          <a className="Link--neutral u-sizeHeight-1_1-2 u-textNoSelect"
             title={this.props.title}
             onClick={this.props.action}>
            <Icon name={this.props.icon}
                  title={this.props.title}
                  className="u-sizeWidth-1"/>
          </a>
        </li>
    )
  }
})

let Pager = React.createClass({

  propTypes: {
    actions: PropTypes.shape({
      firstPage: PropTypes.func.isRequired,
      previousPage: PropTypes.func.isRequired,
      nextPage: PropTypes.func.isRequired,
      lastPage: PropTypes.func.isRequired
    }).isRequired,
    pageNumber: PropTypes.number.isRequired,
    pageCount: PropTypes.number,

    // DO NOT RENAME, the translation string extractor looks specifically
    // for gettextCatalog.getString when generating the translation template.
    gettextCatalog: PropTypes.shape({
      getString: PropTypes.func.isRequired
    }).isRequired
  },

  render: function () {
    let gettextCatalog = this.props.gettextCatalog

    let pageNumber = this.props.pageNumber
    let pageCount = this.props.pageCount

    /* FIXME this is using angular gettext
    let pageXofY = pageCount
      ? gettextCatalog.getString(
        '{{currentPage}} of {{totalPages}}', {
          currentPage: pageNumber,
          totalPages: pageCount
        })
      : pageNumber*/
    let pageXofY = `${pageNumber} of ${pageCount}`

    let actions = this.props.actions
    let buttons = {
      first: {
        icon: 'previous',
        title: gettextCatalog.getString('First page'),
        action: actions.firstPage
      },
      prev: {
        icon: 'chevron-left',
        title: gettextCatalog.getString('Previous page'),
        action: actions.previousPage
      },
      next: {
        icon: 'chevron-right',
        title: gettextCatalog.getString('Next page'),
        action: actions.nextPage
      },
      last: {
        icon: 'next',
        title: gettextCatalog.getString('Last page'),
        action: actions.lastPage
      }
    }

    return (
      <ul className="u-listHorizontal u-textCenter">
        <PagerButton {...buttons.first}/>
        <PagerButton {...buttons.prev}/>
        <li className="u-sizeHeight-1 u-sPH-1-4">
          <span className="u-textNeutral">
            {pageXofY}
          </span>
        </li>
        <PagerButton {...buttons.next}/>
        <PagerButton {...buttons.last}/>
      </ul>
    )
  }
})

export default Pager

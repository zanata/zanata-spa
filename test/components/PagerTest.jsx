import React from 'react'
import Pager from '../../app/components/Pager'
import Icon from '../../app/components/Icon'
import test from 'retap'
import mockGettextCatalog from '../mockAngularGettext'

test('Pager markup', function PagerMarkup (t) {
  const actual = <Pager
    actions={{
      firstPage: () => {},
      previousPage: () => {},
      nextPage: () => {},
      lastPage: () => {}
    }}
    pageNumber={7}
    pageCount={11}

    gettextCatalog={mockGettextCatalog}/>

  const expected = (
    <ul className="u-listHorizontal u-textCenter">
      <li>
        <a className="Link--neutral u-sizeHeight-1_1-2 u-textNoSelect"
          title="First page">
          <Icon name="previous"
            title="First page"
            className="u-sizeWidth-1"/>
        </a>
      </li>
      <li>
        <a className="Link--neutral u-sizeHeight-1_1-2 u-textNoSelect"
          title="Previous page">
          <Icon name="chevron-left"
            title="Previous page"
            className="u-sizeWidth-1"/>
        </a>
      </li>
      <li className="u-sizeHeight-1 u-sPH-1-4">
        <span className="u-textNeutral">
          7 of 11
        </span>
      </li>
      <li>
        <a className="Link--neutral u-sizeHeight-1_1-2 u-textNoSelect"
          title="Next page">
          <Icon name="chevron-right"
            title="Next page"
            className="u-sizeWidth-1"/>
        </a>
      </li>
      <li>
        <a className="Link--neutral u-sizeHeight-1_1-2 u-textNoSelect"
          title="Last page">
          <Icon name="next"
            title="Last page"
            className="u-sizeWidth-1"/>
        </a>
      </li>
    </ul>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('Pager events', function PagerEvents (t) {
  t.plan(4)
  const blank = 'no event'
  var event

  const d20 = t.createComponent(
    <Pager
      actions={{
        firstPage: () => event = 'critical fumble',
        previousPage: () => event = 'fumble',
        nextPage: () => event = 'success',
        lastPage: () => event = 'critical hit'
      }}
      pageNumber={1}
      pageCount={20}
      gettextCatalog={mockGettextCatalog}/>
  )

  // click events are expected on the <a> tags
  const [ first, prev, next, last ] = d20.findByQuery('a')

  event = blank
  first.onClick()
  t.equal(event, 'critical fumble',
    'first-page button should trigger given event')

  event = blank
  prev.onClick()
  t.equal(event, 'fumble',
    'previous-page button should trigger given event')

  event = blank
  next.onClick()
  t.equal(event, 'success',
    'next-page button should trigger given event')

  event = blank
  last.onClick()
  t.equal(event, 'critical hit',
    'last-page button should trigger given event')

  t.end()
})


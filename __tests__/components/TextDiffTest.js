jest.dontMock('lodash')
  .dontMock('../../app/utils/doc-id')
  .dontMock('../../app/utils/filter-paging-util')
  .dontMock('../../app/utils/phrase')
  .dontMock('../../app/utils/RoutingHelpers')
  .dontMock('../../app/utils/status')
  .dontMock('../../app/utils/string-utils')
  .dontMock('../../app/utils/TransStatusService')
  .dontMock('../../app/utils/Util')

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import TextDiff from '../../app/components/TextDiff'

describe('TextDiffTest', () => {
  it('TextDiff markup', () => {
    const actual = ReactDOMServer.renderToStaticMarkup(
      <TextDiff
        text1="It was the best of times"
        text2="It was the worst of times"/>
    )

    const expected = ReactDOMServer.renderToStaticMarkup(
      <div className="Difference">
        <span>It was the </span>
        <del>be</del>
        <ins>wor</ins>
        <span>st of times</span>
      </div>
    )
    expect(actual).toEqual(expected)
  })
})

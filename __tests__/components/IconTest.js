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
import Icon from '../../app/components/Icon'

describe('IconTest', () => {
  it('Icon markup', () => {
    const actual = ReactDOMServer.renderToStaticMarkup(
      <Icon name="classical" title="Mozart" className="pop-icon"/>)

    // have to check this way since JSX does not work for xlink:href
    const expectedSvgContents = {
      __html: '<use xlink:href="#Icon-classical"/><title>Mozart</title>'
    }

    const expected = ReactDOMServer.renderToStaticMarkup(
      <div className="pop-icon Icon">
        <svg className="Icon-item"
             dangerouslySetInnerHTML={expectedSvgContents} />
      </div>
    )
    expect(actual).toEqual(expected)
  })
})

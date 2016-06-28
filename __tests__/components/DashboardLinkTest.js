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
import DashboardLink from '../../app/components/DashboardLink'

describe('DashboardLinkTest', () => {
  it('DashboardLink markup', () => {
    const profilePicSrc =
      'http://www.emoji-cheat-sheet.com/graphics/emojis/smiling_imp.png'

    const actual = ReactDOMServer.renderToStaticMarkup(
      <DashboardLink name="Hades"
                     dashboardUrl="https://en.wikipedia.org/wiki/Hades"
                     gravatarUrl={profilePicSrc}/>
    )

    const expected = ReactDOMServer.renderToStaticMarkup(
      <a href="https://en.wikipedia.org/wiki/Hades"
         className="u-sizeHeight-2 u-sizeWidth-1_1-2 u-inlineBlock"
         title="Hades">
        <img className="u-round Header-avatar"
             src={profilePicSrc}/>
      </a>
    )
    expect(actual).toEqual(expected)
  })
})
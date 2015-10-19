import React from 'react'
import DashboardLink from '../../app/components/DashboardLink'
import test from 'retap'

test('DashboardLink markup', function DashboardLinkMarkup (t) {
  const profilePicSrc =
    'http://www.emoji-cheat-sheet.com/graphics/emojis/smiling_imp.png'

  const actual = (
    <DashboardLink name="Hades"
      dashboardUrl="https://en.wikipedia.org/wiki/Hades"
      gravatarUrl={profilePicSrc}/>
  )

  const expected = (
    <a href="https://en.wikipedia.org/wiki/Hades"
       className="u-sizeHeight-2 u-sizeWidth-1_1-2 u-inlineBlock"
       title="Hades">
      <img className="u-round Header-avatar"
        src={profilePicSrc}/>
    </a>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

import React from 'react'
import Icon from '../../app/components/Icon'
import NoSuggestionsPanel from '../../app/components/NoSuggestionsPanel'
import test from 'retap'

test('NoSuggestionsPanel markup', (t) => {

  const actual = (
    <NoSuggestionsPanel
      message="You're on your own"
      icon="loader"/>
  )

  const expected = (
      <div
        className="u-posCenterCenter u-textEmpty u-textCenter">
        <Icon
          name="loader"
          className="Icon--lg Icon--circle u-sMB-1-4"/>
        <p>You&apos;re on your own</p>
      </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

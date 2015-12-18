import React from 'react'
import TextDiff from '../../app/components/TextDiff'
import test from 'retap'

test('TextDiff markup', (t) => {

  const actual = (
    <TextDiff
      text1="It was the best of times"
      text2="It was the worst of times"/>
  )

  const expected = (
    <div className="Difference">
      <span>It was the </span>
      <del>be</del>
      <ins>wor</ins>
      <span>st of times</span>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

import React from 'react'
import SuggestionMatchPercent from '../../app/components/SuggestionMatchPercent'
import test from 'retap'

test('SuggestionMatchPercent markup (imported)', (t) => {
  const actual = (
    <SuggestionMatchPercent
      matchType="imported"
      percent={12.34567}/>
  )
  const expected = (
    <div className="u-textSecondary">
      12.3%
    </div>
  )
  t.isSameMarkup(actual, expected)
  t.end()
})

test('SuggestionMatchPercent markup (translated)', (t) => {
  const actual = (
    <SuggestionMatchPercent
      matchType="translated"
      percent={46}/>
  )
  const expected = (
    <div className="u-textSuccess">
      46%
    </div>
  )
  t.isSameMarkup(actual, expected)
  t.end()
})

test('SuggestionMatchPercent markup (approved)', (t) => {
  const actual = (
    <SuggestionMatchPercent
      matchType="approved"
      percent={67.89}/>
  )
  const expected = (
    <div className="u-textHighlight">
      67.9%
    </div>
  )
  t.isSameMarkup(actual, expected)
  t.end()
})

test('SuggestionMatchPercent markup (> 99%)', (t) => {
  const actual = (
    <SuggestionMatchPercent
      matchType="approved"
      percent={99.956789}/>
  )
  const expected = (
    <div className="u-textHighlight">
      99.96%
    </div>
  )
  t.isSameMarkup(actual, expected)
  t.end()
})

test('SuggestionMatchPercent markup (99.99999 != 100)', (t) => {
  const actual = (
    <SuggestionMatchPercent
      matchType="approved"
      percent={99.9999999}/>
  )
  const expected = (
    <div className="u-textHighlight">
      99.99%
    </div>
  )
  t.isSameMarkup(actual, expected)
  t.end()
})

test('SuggestionMatchPercent markup (100%)', (t) => {
  const actual = (
    <SuggestionMatchPercent
      matchType="approved"
      percent={100}/>
  )
  const expected = (
    <div className="u-textHighlight">
      100%
    </div>
  )
  t.isSameMarkup(actual, expected)
  t.end()
})

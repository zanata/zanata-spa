import React from 'react'
import TranslatingIndicator from '../../app/components/TranslatingIndicator'
import Icon from '../../app/components/Icon'
import test from 'retap'

test('TranslatingIndicator markup', function TranslatingIndicatorMarkup (t) {
  const gettextCatalog = {
    getString: (key) => {
      return key
    }
  }
  const actual = <TranslatingIndicator gettextCatalog={gettextCatalog}/>

  const expected = (
    <button className="Link--neutral u-sPV-1-4 u-floatLeft
                       u-sizeHeight-1_1-2 u-sMR-1-4">
      <Icon name="translate"/> <span
        className="u-ltemd-hidden u-sMR-1-4">
        Translating
      </span>
    </button>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

import React from 'react'
import Icon from '../../app/components/Icon'
import test from 'retap'

test('Icon markup', function IconMarkup (t) {
  const actual = <Icon name="classical" title="Mozart" className="pop-icon"/>
  // have to check this way since JSX does not work for xlink:href
  const expectedSvgContents = {
    __html: '<use xlink:href="#Icon-classical"/><title>Mozart</title>'
  }

  const expected = (
    <div className="Icon pop-icon">
      <svg className="Icon-item"
           dangerouslySetInnerHTML={expectedSvgContents} />
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

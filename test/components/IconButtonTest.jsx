import React from 'react'
import IconButton from '../../app/components/IconButton'
import Icon from '../../app/components/Icon'
import test from 'retap'

test('IconButton markup (active)', function IconButtonActiveMarkup (t) {
  var clickFun = function (e) {}

  const actual = <IconButton
    icon="classical"
    title="Mozart"
    onClick={clickFun}
    active={true}
    className="pop-icon"/>

  const expected = (
    <button
      className="is-active Button Button--snug u-roundish Button--invisible"
      onClick={clickFun}
      title="Mozart">
      <Icon
        name="classical"
        title="Mozart"
        className="Icon--sm pop-icon"/>
    </button>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('IconButton markup (inactive)', function IconButtonInactiveMarkup (t) {
  var clickFun = function (e) {}

  const actual = <IconButton
    icon="tea"
    title="Tea"
    onClick={clickFun}
    active={false}
    className="cultural-icon"/>

  const expected = (
    <button
      className="Button Button--snug u-roundish Button--invisible"
      onClick={clickFun}
      title="Tea">
      <Icon
        name="tea"
        title="Tea"
        className="Icon--sm cultural-icon"/>
    </button>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('IconButton click event', function IconButtonInactiveMarkup (t) {
  t.plan(1)

  var clickEvent = 'freshing'
  var clickFun = function (e) {
    clickEvent = e
  }

  const refreshButton = t.createComponent(
    <IconButton
      icon="iced-tea"
      title="Iced Tea"
      onClick={clickFun}
      active={true}/>
  )

  // simulate click event
  refreshButton.onClick('refreshing')

  t.equal(clickEvent, 'refreshing',
    'IconButton click event should fire with correct event payload')
})

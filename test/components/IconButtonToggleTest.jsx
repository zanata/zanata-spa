import React from 'react'
import IconButton from '../../app/components/IconButton'
import IconButtonToggle from '../../app/components/IconButtonToggle'
import test from 'retap'

test('IconButtonToggle is just a IconButton with extra styles', (t) => {
  var clickFun = function (e) {}

  const actual = <IconButtonToggle
    icon="classical"
    title="Mozart"
    onClick={clickFun}
    active={false}
    disabled={true}
    className="pop-icon"/>

  const expected = (
    <IconButton
      icon="classical"
      title="Mozart"
      onClick={clickFun}
      disabled={true}
      iconClass="pop-icon"
      buttonClass="Button Button--snug u-roundish Button--invisible"/>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('IconButtonToggle adds active style', (t) => {
  var clickFun = function (e) {}

  const actual = <IconButtonToggle
    icon="classical"
    title="Mozart"
    onClick={clickFun}
    active={true}
    className="pop-icon"/>

  const expected = (
    <IconButton
      active={true}
      buttonClass="is-active Button Button--snug u-roundish Button--invisible"
      icon="classical"
      title="Mozart"
      onClick={clickFun}
      iconClass="pop-icon"/>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

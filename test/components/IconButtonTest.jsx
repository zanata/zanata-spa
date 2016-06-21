import React from 'react'
import Icon from '../../app/components/Icon'
import IconButton from '../../app/components/IconButton'
import test from 'retap'

test('IconButton markup', (t) => {
  var clickFun = function (e) {}

  const actual = <IconButton
    icon="classical"
    title="Mozart"
    onClick={clickFun}
    iconClass="pop-icon"
    buttonClass="push-me"/>

  const expected = (
    <button
      className="push-me"
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

test('IconButton markup (disabled)', (t) => {
  var clickFun = function (e) {}

  const actual = <IconButton
    icon="tea"
    title="Tea"
    onClick={clickFun}
    iconClass="cultural-icon"
    buttonClass="drink-me"
    disabled={true}/>

  const expected = (
    <button
      className="drink-me is-disabled"
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

test('IconButton click event', (t) => {
  t.plan(1)

  var clickEvent = 'freshing'
  var clickFun = function (e) {
    clickEvent = e
  }

  const refreshButton = t.createComponent(
    <IconButton
      icon="iced-tea"
      title="Iced Tea"
      onClick={clickFun}/>
  )

  // simulate click event
  refreshButton.onClick('refreshing')

  t.equal(clickEvent, 'refreshing',
    'IconButton click event should fire with correct event payload')
})

test('IconButton does not fire click when disabled', (t) => {
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
      disabled={true}/>
  )

  // throws if onClick is not bound
  try {
    // simulate click event
    refreshButton.onClick('refreshing')
  } catch (e) {
    // swallow on purpose, valid for code to not bind onClick
  }

  t.equal(clickEvent, 'freshing',
    'IconButton click event should not fire when props.disabled is true')
})

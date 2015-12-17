import React from 'react'
import Button from '../../app/components/Button'
import test from 'retap'

test('Button markup', (t) => {
  var clickFun = function (e) {}

  const actual = (
    <Button
      title="Come on! Do it! Do it!"
      onClick={clickFun}
      className="im here">
      Come on!
    </Button>
    )

  const expected = (
    <button
      className="im here"
      disabled={false}
      onClick={clickFun}
      title="Come on! Do it! Do it!">
      Come on!
    </button>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('Button markup', (t) => {
  var clickFun = function (e) {}

  const actual = (
    <Button
      disabled={true}
      title="No such thing, ol' buddy"
      onClick={clickFun}
      className="one-way-ticket">
      Who&apos;s our backup?
    </Button>
    )

  const expected = (
    <button
      disabled={true}
      className="is-disabled one-way-ticket"
      onClick={undefined}
      title="No such thing, ol' buddy">
      Who&apos;s our backup?
    </button>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('Button click event', (t) => {
  t.plan(1)

  var clickEvent = 'nowhere'
  var getToTheChopper = function (e) {
    clickEvent = e
  }

  const escapeButton = t.createComponent(
    <Button
      onClick={getToTheChopper}>
      Run! Get to...
    </Button>
  )

  // simulate click event
  escapeButton.onClick('the chopper')

  t.equal(clickEvent, 'the chopper',
    'Button click event should fire with correct event payload')
})

test('Button does not fire click when disabled', (t) => {
  t.plan(1)

  var clickEvent = 'nowhere'
  var getToTheChopper = function (e) {
    clickEvent = e
  }

  const escapeButton = t.createComponent(
    <Button
      disabled={true}
      onClick={getToTheChopper}>
      Run! Get to...
    </Button>
  )

  // throws if onClick is not bound
  try {
    // simulate click event
    escapeButton.onClick('the chopper')
  } catch (e) {
    // swallow on purpose, valid for code to not bind onClick
  }

  t.equal(clickEvent, 'nowhere',
    'Button click event should not fire when props.disabled is true')
})

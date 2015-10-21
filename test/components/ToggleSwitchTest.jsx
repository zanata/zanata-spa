import React from 'react'
import ToggleSwitch from '../../app/components/ToggleSwitch'
import test from 'retap'

test('ToggleSwitch markup', function ToggleSwitchMarkup (t) {
  const switchTheBlade = () => {}
  const actual = (
    <ToggleSwitch id="switchblade"
      className="bayonet"
      isChecked={true}
      onChange={switchTheBlade}
      label="Switchington"/>
  )

  const expected = (
    <span className="Switch bayonet">
      <input className="Switch-checkbox"
             type="checkbox"
             id="switchblade"
             checked={true}
             onChange={switchTheBlade}/>
      <label className="Switch-label" htmlFor="switchblade">
        <span className="Switch-labelText">Switchington</span>
      </label>
    </span>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('ToggleSwitch markup (unchecked)', function ToggleSwitchMarkupUnch (t) {
  const switchTheBlade = () => {}
  const actual = (
    <ToggleSwitch id="switchblade"
      className="bayonet"
      isChecked={false}
      onChange={switchTheBlade}
      label="Switchington"/>
  )

  const expected = (
    <span className="Switch bayonet">
      <input className="Switch-checkbox"
             type="checkbox"
             id="switchblade"
             checked={false}
             onChange={switchTheBlade}/>
      <label className="Switch-label" htmlFor="switchblade">
        <span className="Switch-labelText">Switchington</span>
      </label>
    </span>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('ToggleSwitch onchange', function ToggleSwitchOnchange (t) {
  var blade = 'retracted'
  const switchTheBlade = () => {
    blade = 'extended'
  }

  const switchComponent = t.createComponent(
    <ToggleSwitch id="switchblade"
      className="bayonet"
      isChecked={false}
      onChange={switchTheBlade}
      label="Switchington"/>
  )

  switchComponent.findByQuery('input#switchblade')[0].onChange()
  t.equal(blade, 'extended',
    'should call onChange action when input is changed')

  t.end()
})

import React from 'react'
import Dropdown from '../../app/components/Dropdown'
import test from 'retap'
import { map } from 'lodash'

test('Dropdown markup (closed)', function DropdownMarkupClosed (t) {
  const toggleTheDoor = () => {}
  const actual = (
    <Dropdown
      onToggle={toggleTheDoor}
      isOpen={false}
      enabled={true}
      className="boom acka lacka">
      <Dropdown.Button>
        <button>Boom boom acka lacka lacka boom</button>
      </Dropdown.Button>
      <Dropdown.Content>
        <ul>
          <li>Open the door</li>
          <li>Get on the floor</li>
          <li>Everybody walk the dinosaur</li>
        </ul>
        <a href="https://youtu.be/vgiDcJi534Y">Was Not Was</a>
      </Dropdown.Content>
    </Dropdown>
  )

  const expected = (
    <div className="Dropdown boom acka lacka">
      <div className="Dropdown-toggle"
        aria-haspopup={true}
        aria-expanede={false}
        onClick={toggleTheDoor}>
        <button>Boom boom acka lacka lacka boom</button>
      </div>
      <div className="Dropdown-content Dropdown-content--bordered">
        <ul>
          <li>Open the door</li>
          <li>Get on the floor</li>
          <li>Everybody walk the dinosaur</li>
        </ul>
        <a href="https://youtu.be/vgiDcJi534Y">Was Not Was</a>
      </div>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('Dropdown markup (open)', function DropdownMarkupOpen (t) {
  const toggleTheDoor = () => {}
  const actual = (
    <Dropdown
      onToggle={toggleTheDoor}
      isOpen={true}
      enabled={true}
      className="boom acka lacka">
      <Dropdown.Button>
        <button>Boom boom acka lacka lacka boom</button>
      </Dropdown.Button>
      <Dropdown.Content>
        <ul>
          <li>Open the door</li>
          <li>Get on the floor</li>
          <li>Everybody walk the dinosaur</li>
        </ul>
        <a href="https://youtu.be/83nFiPoSuzU">Was Not Was</a>
      </Dropdown.Content>
    </Dropdown>
  )

  const expected = (
    <div className="is-active Dropdown boom acka lacka">
      <div className="Dropdown-toggle"
        aria-haspopup={true}
        aria-expanede={true}
        onClick={toggleTheDoor}>
        <button>Boom boom acka lacka lacka boom</button>
      </div>
      <div className="Dropdown-content Dropdown-content--bordered">
        <ul>
          <li>Open the door</li>
          <li>Get on the floor</li>
          <li>Everybody walk the dinosaur</li>
        </ul>
        <a href="https://youtu.be/83nFiPoSuzU">Was Not Was</a>
      </div>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('Dropdown disabled', (t) => {
  var theDoor = 'closed'
  const toggleTheDoor = () => {
    theDoor = 'open'
  }

  const dinoWalkDropdown = t.createComponent(
    <Dropdown
      onToggle={toggleTheDoor}
      isOpen={true}
      enabled={false}
      className="boom acka lacka">
      <Dropdown.Button>
        <button>Boom boom acka lacka lacka boom</button>
      </Dropdown.Button>
      <Dropdown.Content>
        <ul>
          <li>Open the door</li>
          <li>Get on the floor</li>
          <li>Everybody walk the dinosaur</li>
        </ul>
        <a href="https://youtu.be/83nFiPoSuzU">Was Not Was</a>
      </Dropdown.Content>
    </Dropdown>
  )

  // throws if onClick is not bound
  try {
    dinoWalkDropdown.findByQuery('.Dropdown-toggle')[0].onClick()
  } catch (e) {
    // swallow on purpose, valid for code to not bind onClick
  }
  t.equal(theDoor, 'closed', 'click on disabled dropdown button should not ' +
    'trigger given toggle function')
  t.end()
})

test('Dropdown events', {skip: 'shallowRender does not support refs'}, (t) => {
  var theDoor = 'closed'
  const toggleTheDoor = (buttonDOMNode) => {
    theDoor = 'open'
    // the DOM node is for interop with legacy (Angular) code to focus
    // the button.
    t.equal(buttonDOMNode, 'an actual DOM node',
      'toggle function should be given the DOM node of the dropdown button')
  }

  const dinoWalkDropdown = t.createComponent(
    <Dropdown
      onToggle={toggleTheDoor}
      isOpen={true}
      enabled={true}
      className="boom acka lacka">
      <Dropdown.Button>
        <button>Boom boom acka lacka lacka boom</button>
      </Dropdown.Button>
      <Dropdown.Content>
        <ul>
          <li>Open the door</li>
          <li>Get on the floor</li>
          <li>Everybody walk the dinosaur</li>
        </ul>
        <a href="https://youtu.be/83nFiPoSuzU">Was Not Was</a>
      </Dropdown.Content>
    </Dropdown>
  )

  // FIXME shallowRender does not support refs. The onToggle event needs refs to
  //       run (throws an exception without them), so the test cannot run.
  // Some sort of hack may be possible, maybe something like (but not exactly)
  //
  // dinoWalkDropdown.refs = {
  //   button: {
  //     getDOMNode: () => 'an actual DOM node'
  //   }
  // }

  // Need refs.button to exist for this check, skip until a solution is found
  // or the need for refs is removed

  t.skip('click event simulation (needs refs, not supported by test harness)')
  // dinoWalkDropdown.findByQuery('.Dropdown-toggle')[0].onClick()
  t.skip('check callback has been called, needs event simulation')
  // t.equal(theDoor, 'open',
  //   'click on dropdown button should trigger given toggle function')
  t.end()
})

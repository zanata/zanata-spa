import React from 'react'
import DocsDropdown from '../../app/components/DocsDropdown'
import Dropdown from '../../app/components/Dropdown'
import Icon from '../../app/components/Icon'
import test from 'retap'

test('DocsDropdown markup', function DocsDropdownMarkup (t) {
  const eatLettuce = () => {}
  const actual = (
    <DocsDropdown
      context={{
        projectVersion: {
          project: {
            slug: 'slimy'
          },
          version: 'slick',
          docs: [
            'snail.txt',
            'gastropod.txt',
            'cephalopod.txt'
          ]
        },
        selectedDoc: {
          id: 'gastropod.txt'
        },
        selectedLocale: 'sluggish'
      }}
      toggleDropdown={eatLettuce}
      isOpen={true}/>
  )

  const expected = (
    <Dropdown onToggle={eatLettuce}
              isOpen={true}>
      <Dropdown.Button>
        <button className="Link--invert">
          gastropod.txt
          <Icon name="chevron-down"
                className="Icon--sm Dropdown-toggleIcon u-sML-1-8"/>
        </button>
      </Dropdown.Button>
      <Dropdown.Content>
        <ul>
          <li key="snail.txt">
            <a href="#/slimy/slick/translate/snail.txt/sluggish"
              className="Dropdown-item">snail.txt</a>
          </li>
          <li key="gastropod.txt">
            <a href="#/slimy/slick/translate/gastropod.txt/sluggish"
              className="Dropdown-item">gastropod.txt</a>
          </li>
          <li key="cephalopod.txt">
            <a href="#/slimy/slick/translate/cephalopod.txt/sluggish"
              className="Dropdown-item">cephalopod.txt</a>
          </li>
        </ul>
      </Dropdown.Content>
    </Dropdown>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

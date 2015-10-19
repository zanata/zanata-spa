import React from 'react'
import UiLanguageDropdown from '../../app/components/UiLanguageDropdown'
import Dropdown from '../../app/components/Dropdown'
import test from 'retap'

test('UiLanguageDropdown markup', function UiLanguageDropdownMarkup (t) {
  const workingOnMyRoar = () => {}
  const nowSeeHere = () => {}
  const actual = (
    <UiLanguageDropdown
      changeUiLocale={workingOnMyRoar}
      selectedUiLocale="tn"
      uiLocales={{
        st: {
          id: 'st',
          name: 'Sesotho'
        },
        tn: {
          id: 'tn',
          name: 'Setswana'
        },
        sw: {
          id: 'sw',
          name: 'Swahili'
        },
        zu: {
          id: 'zu',
          name: 'Zulu'
        }
      }}
      toggleDropdown={nowSeeHere}
      isOpen={true}/>
  )

  const expected = (
    <Dropdown onToggle={nowSeeHere}
              isOpen={true}
              className="Dropdown--right u-sMV-1-2">
      <Dropdown.Button>
        <a className="Link--invert u-inlineBlock u-textNoWrap u-sPH-1-4">
          Setswana
        </a>
      </Dropdown.Button>
      <Dropdown.Content>
        <ul>
          <li key="st">
            <a className="Dropdown-item">
              Sesotho
            </a>
          </li>
          <li key="tn">
            <a className="Dropdown-item">
              Setswana
            </a>
          </li>
          <li key="sw">
            <a className="Dropdown-item">
              Swahili
            </a>
          </li>
          <li key="zu">
            <a className="Dropdown-item">
              Zulu
            </a>
          </li>
        </ul>
      </Dropdown.Content>
    </Dropdown>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('UiLanguageDropdown events', function UiLanguageDropdownMarkup (t) {
  var myRoar = 'puny'
  const workingOnMyRoar = (newLocale) => {
    myRoar = 'thunderous'
    t.deepEqual(newLocale, {
      // TODO change to id: when getting rid of Angular
      localeId: 'sw',
      name: 'Swahili'
    }, 'should call changeUiLocale callback with a well-formatted locale object')
  }
  const nowSeeHere = () => {}

  const uiLangDropdown = t.createComponent(
    <UiLanguageDropdown
      changeUiLocale={workingOnMyRoar}
      selectedUiLocale="tn"
      uiLocales={{
        st: {
          id: 'st',
          name: 'Sesotho'
        },
        tn: {
          id: 'tn',
          name: 'Setswana'
        },
        sw: {
          id: 'sw',
          name: 'Swahili'
        },
        zu: {
          id: 'zu',
          name: 'Zulu'
        }
      }}
      toggleDropdown={nowSeeHere}
      isOpen={true}/>
  )

  uiLangDropdown.findByQuery('li > a')[2].onClick()
  t.equal(myRoar, 'thunderous',
    'changeUiLocale callback should run when a language is clicked')
  t.end()
})

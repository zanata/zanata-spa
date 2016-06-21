import React from 'react'
import TransUnitFilter from '../../app/components/TransUnitFilter'
import FilterToggle from '../../app/components/FilterToggle'
import Icon from '../../app/components/Icon'
import test from 'retap'
import mockGettextCatalog from '../mockAngularGettext'

test('FilterToggle markup', function FilterToggleMarkup (t) {
  const doStuff = () => {}
  const actual = (
    <FilterToggle id="government-issued"
      className="soClassy"
      isChecked={true}
      onChange={doStuff}
      title="titalic"
      count="12"
      withDot={true}/>
  )

  const expected = (
    <div className="Toggle u-round soClassy">
      <input className="Toggle-checkbox"
             type="checkbox"
             id="government-issued"
             checked={true}
             onChange={doStuff}/>
      <span className="Toggle-fakeCheckbox"/>
      <label className="Toggle-label"
             htmlFor="government-issued"
             title="titalic">
        <Icon name="dot" className="Icon--xsm"/>
        12
        <span className="u-hiddenVisually">titalic</span>
      </label>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('FilterToggle markup (unchecked)', function FilterToggleMarkupUnch (t) {
  const doStuff = () => {}
  const actual = (
    <FilterToggle id="government-issued"
      className="soClassy"
      isChecked={false}
      onChange={doStuff}
      title="titalic"
      count="17"
      withDot={false}/>
  )

  const expected = (
    <div className="Toggle u-round soClassy">
      <input className="Toggle-checkbox"
             type="checkbox"
             id="government-issued"
             checked={false}
             onChange={doStuff}/>
      <span className="Toggle-fakeCheckbox"/>
      <label className="Toggle-label"
             htmlFor="government-issued"
             title="titalic">
        17
        <span className="u-hiddenVisually">titalic</span>
      </label>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('TransUnitFilter markup', function TransUnitFilterMarkup (t) {
  const actual = (
    <TransUnitFilter
      actions={{
        resetFilter: () => {},
        onFilterChange: () => {}
      }}
      filter={{
        all: true,
        approved: false,
        translated: true,
        needsWork: false,
        untranslated: true
      }}
      counts={{
        total: 1,
        approved: 2,
        translated: 3,
        needswork: 4,
        untranslated: 5
      }}
      gettextCatalog={mockGettextCatalog}/>
  )

  const expected = (
    <ul className="u-listHorizontal u-sizeHeight-1">
      <li className="u-sm-hidden u-sMV-1-4">
        <FilterToggle
          id="filter-phrases-total"
          className="u-textSecondary"
          isChecked={true}
          title="Total Phrases"
          count={1}
          onChange={()=>{}}
          withDot={false}/>
      </li>
      <li className="u-ltemd-hidden u-sMV-1-4">
        <FilterToggle
          id="filter-phrases-approved"
          className="u-textHighlight"
          isChecked={false}
          title="Approved"
          count={2}
          onChange={()=>{}}/>
      </li>
      <li className="u-ltemd-hidden u-sMV-1-4">
        <FilterToggle
          id="filter-phrases-translated"
          className="u-textSuccess"
          isChecked={true}
          title="Translated"
          count={3}
          onChange={()=>{}}/>
      </li>
      <li className="u-ltemd-hidden u-sMV-1-4">
        <FilterToggle
          id="filter-phrases-needs-work"
          className="u-textUnsure"
          isChecked={false}
          title="Needs Work"
          count={4}
          onChange={()=>{}}/>
      </li>
      <li className="u-ltemd-hidden u-sMV-1-4">
        <FilterToggle
          id="filter-phrases-untranslated"
          className="u-textNeutral"
          isChecked={true}
          title="Untranslated"
          count={5}
          onChange={()=>{}}/>
      </li>
    </ul>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('TransUnitFilter events', function TransUnitFilterEvents (t) {
  var filterReset = false
  const resetFilter = () => {
    filterReset = true
  }

  var filterChangeType = 'none'
  const onFilterChange = statusType => {
    filterChangeType = statusType
  }

  const filterComponent = t.createComponent(
    <TransUnitFilter
      actions={{
        resetFilter: resetFilter,
        onFilterChange: onFilterChange
      }}
      filter={{
        all: true,
        approved: false,
        translated: true,
        needsWork: false,
        untranslated: true
      }}
      counts={{
        total: 1,
        approved: 2,
        translated: 3,
        needswork: 4,
        untranslated: 5
      }}
      gettextCatalog={mockGettextCatalog}/>
  )

  filterComponent.findByQuery('input#filter-phrases-needs-work')[0].onChange()
  t.equal(filterChangeType, 'needsWork',
    'should call filter toggle action with correct type when specific status ' +
    'is changed')

  filterComponent.findByQuery('input#filter-phrases-total')[0].onChange()
  t.equal(filterReset, true,
    'should call given reset function when total/all is changed')

  t.end()
})

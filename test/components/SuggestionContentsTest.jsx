import React from 'react'
import SuggestionContents from '../../app/components/SuggestionContents'
import TextDiff from '../../app/components/TextDiff'
import test from 'retap'

test('SuggestionContent markup (singular)', (t) => {
  const actual = (
    <SuggestionContents
      plural={false}
      contents={['As thick as you are, pay attention!']}/>
  )

  const expected = (
    <div>
      <div className="TransUnit-item">
        <div className="TransUnit-itemHeader" />
        <div className="TransUnit-text TransUnit-text--tight">
          As thick as you are, pay attention!
        </div>
      </div>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('SuggestionContent markup (plural)', (t) => {
  const actual = (
    <SuggestionContents
      plural={true}
      contents={[
        'As thick as you are, pay attention!',
        'Even you can be caught unawares'
      ]}/>
  )

  const expected = (
    <div>
      <div className="TransUnit-item">
        <div className="TransUnit-itemHeader">
          <span className="u-textMeta">Singular Form</span>
        </div>
        <div className="TransUnit-text">
          As thick as you are, pay attention!
        </div>
      </div>
      <div className="TransUnit-item">
        <div className="TransUnit-itemHeader">
          <span className="u-textMeta">Plural Form</span>
        </div>
        <div className="TransUnit-text">
          Even you can be caught unawares
        </div>
      </div>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('SuggestionContent markup (with diff)', (t) => {
  const actual = (
    <SuggestionContents
      plural={false}
      contents={['As thick as you are, pay attention!']}
      compareTo={['As slick as you are, play attrition?']}/>
  )

  const expected = (
    <div>
      <div className="TransUnit-item">
        <div className="TransUnit-itemHeader" />
        <TextDiff
          className="Difference TransUnit-text TransUnit-text--tight"
          text1="As slick as you are, play attrition?"
          text2="As thick as you are, pay attention!"/>
      </div>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

test('SuggestionContent markup (plural with diff)', (t) => {
  const actual = (
    <SuggestionContents
      plural={true}
      contents={[
        'As thick as you are, pay attention!',
        'Even you can be caught unawares'
      ]}
      compareTo={[
        'As slick as you are, play attrition?'
      ]}/>
  )

  const expected = (
    <div>
      <div className="TransUnit-item">
        <div className="TransUnit-itemHeader">
          <span className="u-textMeta">Singular Form</span>
        </div>
        <TextDiff
          className="Difference TransUnit-text"
          text1="As slick as you are, play attrition?"
          text2="As thick as you are, pay attention!"/>
      </div>
      <div className="TransUnit-item">
        <div className="TransUnit-itemHeader">
          <span className="u-textMeta">Plural Form</span>
        </div>
        <TextDiff
          className="Difference TransUnit-text"
          text1=""
          text2="Even you can be caught unawares"/>
      </div>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

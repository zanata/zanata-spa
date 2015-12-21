import React from 'react'
import Icon from '../../app/components/Icon'
import SuggestionSources from '../../app/components/SuggestionSources'
import SuggestionContents from '../../app/components/SuggestionContents'
import SuggestionSourceDetails from '../../app/components/SuggestionSourceDetails'
import test from 'retap'

test('SuggestionSources markup', (t) => {
  const actual = (
    <SuggestionSources
      showDiff={false}
      suggestion={{
        matchDetails: [
          {
            type: 'IMPORTED_TM',
            transMemorySlug: 'patterson'
          }
        ],
        sourceContents: [
          'There was movement at the station',
          'for the word had passed around'
        ]
      }}/>
  )

  const expected = (
    <div className="TransUnit-panel TransUnit-source">
      <SuggestionContents
        plural={true}
        contents={[
          'There was movement at the station',
          'for the word had passed around'
        ]}
        compareTo={undefined}/>
      <SuggestionSourceDetails
        suggestion={{
          matchDetails: [
            {
              type: 'IMPORTED_TM',
              transMemorySlug: 'patterson'
            }
          ],
          sourceContents: [
            'There was movement at the station',
            'for the word had passed around'
          ]
        }}/>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})

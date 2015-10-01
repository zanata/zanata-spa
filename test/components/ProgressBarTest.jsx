import React from 'react'
import ProgressBar from '../../app/components/ProgressBar'
import test from 'retap'

test('ProgressBar markup', function ProgressBarMarkup (t) {
  const counts = {
    total: 100,
    approved: 10,
    translated: 20,
    needswork: 30,
    untranslated: 40
  }

  const actual = (
    <ProgressBar size="small" counts={counts}/>
  )

  const expected = (
    <div className="Progressbar Progressbar--sm">
      <span
        className="Progressbar-item Progressbar-approved"
        style={{ marginLeft: '0%', width: '10%' }}/>
      <span
        className="Progressbar-item Progressbar-translated"
        style={{ marginLeft: '10%', width: '20%' }}/>
      <span
        className="Progressbar-item Progressbar-needsWork"
        style={{ marginLeft: '30%', width: '30%' }}/>
      <span
        className="Progressbar-item Progressbar-untranslated"
        style={{ marginLeft: '60%', width: '40%' }}/>
    </div>
  )

  t.isSameMarkup(actual, expected)

  t.end()
})

import React from 'react'
import { IntlMixin } from 'react-intl'
import Icon from '../Icon'

/**
 * Display metadata for suggestion source.
 */
let SuggestionSourceDetails = React.createClass({
  mixins: [IntlMixin],

  propTypes: {
    suggestion: React.PropTypes.shape({
      matchDetails: React.PropTypes.arrayOf(React.PropTypes.shape({
        type: React.PropTypes.oneOf(
          ['IMPORTED_TM', 'LOCAL_PROJECT']).isRequired,
        transMemorySlug: React.PropTypes.string,
        projectId: React.PropTypes.string,
        projectName: React.PropTypes.string,
        version: React.PropTypes.string,
        documentPath: React.PropTypes.string,
        documentName: React.PropTypes.string
      }))
    })
  },

  render: function () {
    let matchDetails = this.props.suggestion.matchDetails
    let topMatch = matchDetails[0]
    let isTextFlow = topMatch.type === 'LOCAL_PROJECT'

    let projectIcon = isTextFlow ? (
      <li title={topMatch.projectId}>
        <Icon name="project" className="Icon--xsm"/> {topMatch.projectName}
      </li>
    ) : undefined

    let versionIcon = isTextFlow ? (
      <li>
        <Icon name="version" className="Icon--xsm"/> {topMatch.version}
      </li>
    ) : undefined

    let documentPath = topMatch.documentPath ? topMatch.documentPath + '/' : ''
    let documentIcon = isTextFlow ? (
      <li title={documentPath + topMatch.documentName}>
        <Icon name="document" className="Icon--xsm"/> {topMatch.documentName}
      </li>
    ) : undefined

    let importIcon = isTextFlow ? undefined : (
      <li>
        <Icon name="import" className="Icon--xsm"/> {topMatch.transMemorySlug}
      </li>
    )

    let remainingIcon = matchDetails.length > 1 ? (
      <li>
        <Icon name="translate" class="Icon--xsm"
        /> {matchDetails.length - 1} more occurrences
      </li>
    ) : undefined

    return (
      <div className="TransUnit-details">
        <ul className="u-textMeta u-listInline u-sizeLineHeight-1">
          {projectIcon}
          {versionIcon}
          {documentIcon}
          {importIcon}
          {remainingIcon}
        </ul>
      </div>
    )
  }
})

export default SuggestionSourceDetails

import React, { PropTypes } from 'react'
import Icon from '../components/Icon'
import TransUnit from '../components/TransUnit'
import { connect } from 'react-redux'

/**
 * Single row in the editor displaying a whole phrase.
 * Including source, translation, metadata and editing
 * facilities.
 */
const MainContent = React.createClass({

  propTypes: {
    // from editorContent.phrases
    phrases: PropTypes.arrayOf(PropTypes.object).isRequired
  },

  render: function () {
    console.log('MainContent')
    console.dir(this.props)

    const phrases = this.props.phrases

    if (phrases.length === 0) {
      // TODO translate "No content"
      return (
        <div className="u-posCenterCenter u-textEmpty u-textCenter">
          <Icon name="translate"
                className="Icon--lg Icon--circle u-sMB-1-4"/>
          <p>No content</p>
        </div>
      )
    }

    const transUnits = phrases.map((phrase, index) => {
      // FIXME maybe use phrase id, next page will have
      //       same index for different id. Not sure if
      //       that will matter though.
      return (
        <li key={index}>
          <TransUnit index={index}/>
        </li>
      )
    })

    return (
      <ul className="Editor-translations">
        {transUnits}
      </ul>
    )
  }
})

function mapStateToProps (state, ownProps) {
  return {
    context: state.context,
    phrases: state.phrases.inDoc[state.context.docId] || []
  }
}

export default connect(mapStateToProps)(MainContent)

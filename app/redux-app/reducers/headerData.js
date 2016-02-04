import { ROUTING_PARAMS_CHANGED } from '../actions'
import updateObject from 'react-addons-update'

const defaultState = {
  user: {},
  context: {
    projectVersion: {
      project: {
        slug: editor.context.projectSlug
        // name: defined below
      },
      version: editor.context.versionSlug,
        // url defined below
          docs: /*_.pluck(editor.documents || [], 'name')*/ ['todo load doc names'],
          locales: getLocales()
    },
    selectedDoc: {
      // id: defined below
      counts: _.mapValues(editor.messageStatistic,
          function (numberString) {
            return parseInt(numberString, 10)
          })
    }
    // selectedLocale: defined below
  }
}

export default headerData = (state = defaultState, action) => {
  switch (action.type) {
    // TODO pahuang listen to same action?
    case ROUTING_PARAMS_CHANGED:
      const { projectSlug, versionSlug, lang, docId } = action.params
      return updateObject(
          state, {
            context: {
              projectVersion: {
                project: {
                  slug: {
                    $set: projectSlug
                  }
                  // name
                },
                version: {
                  $set: versionSlug
                }
              }
            }
          }
      )
    default:
      return state
  }
}

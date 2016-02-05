import { FETCHED_STATISTICS, MY_INFO_FETCHED } from '../actions/headerActions'
import updateObject from 'react-addons-update'

const defaultState = {
  user: {
    name: undefined,
    email: undefined,
    gravatarUrl: undefined,
    dashboardUrl: undefined
  },
  context: {
    projectVersion: {
      project: {
        slug: /*editor.context.projectSlug*/ undefined
        // name: defined below
      },
      version: /*editor.context.versionSlug*/ undefined,
        // url defined below
          docs: /*_.pluck(editor.documents || [], 'name')*/ ['todo load doc names'],
          locales: /*getLocales()*/ [], // TODO getLocales()
    },
    selectedDoc: {
      // id: defined below
      // TODO pahuang load it
      counts: /*_.mapValues(editor.messageStatistic,
          function (numberString) {
            return parseInt(numberString, 10)
          }),*/
      {

      },
      id: undefined
    }
    // selectedLocale: defined below
  }
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCHED_STATISTICS:

      return updateObject(
          state, {
            context: {
              projectVersion: {
                project: {
                  slug: {
                    $set: action.data.projectSlug
                  }
                  // name
                },
                version: {
                  $set: action.data.versionSlug
                }
              },
              selectedDoc: {
                id: {
                  $set: aciton.data.docId
                },
                counts: {
                  $set: action.data.counts
                }

              }
            }
          }
      )
    case MY_INFO_FETCHED:
      return updateObject(state, {
        user: {
          name: {
            $set: action.data.name
          },
          email: {
            $set: action.data.email
          },
          gravatarUrl: {
            $set: `http://www.gravatar.com/avatar/${action.data.gravatarHash}?d=mm&ampr=g&amps=${72}`
          },
          dashboardUrl: {
            // FIXME pahuang dashboard url
            $set: `${baseUrl}/dashboard`
          }

        }
      })
    default:
      return state
  }
}

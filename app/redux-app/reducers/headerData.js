import { FETCHED_STATISTICS, MY_INFO_FETCHED, PROJECT_INFO_FETCHED, DOCUMENT_SELECTED, DOCUMENT_LIST_FETCHED } from '../actions/headerActions'
import updateObject from 'react-addons-update'
import {mapValues, pick, pluck} from 'lodash'

const defaultState = {
  user: {
    name: '',
    gravatarUrl: '',
    dashboardUrl: ''
  },
  context: {
    projectVersion: {
      project: {
        slug: /*editor.context.projectSlug*/ '',
        name: ''
        // name: defined below
      },
      version: /*editor.context.versionSlug*/ '',
        // url defined below
      url: '',
      docs: /*_.pluck(editor.documents || [], 'name')*/ [], // TODO pahuang implement this
      locales: /*getLocales()*/ {} // TODO pahuang getLocales()
    },
    selectedDoc: {
      counts: {
        total: 0,
        approved: 0,
        translated: 0,
        needswork: 0,
        untranslated: 0
      },
      id: ''
    },
    selectedLocale: '' // TODO pahuang implement this
  }
}

const projectPage = (projectSlug, versionSlug) => {
  // TODO pahuang set server context path
  const serverContextPath = '';
  return `${serverContextPath}iteration/view/${projectSlug}/${versionSlug}`
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case DOCUMENT_LIST_FETCHED:
      const docs = pluck(action.data || [], 'name');
      return updateObject(state, {
        context: {
          docs: {
            $set: docs
          }
        }
      });

    case FETCHED_STATISTICS:
      const {projectSlug, versionSlug, docId} = action.data;
      // TODO pahuang first is word stats and second is message stats
      //const counts = mapValues(action.data.counts[1], (numStr) => parseInt(numStr, 10));
      const msgStatsStr = pick(action.data.counts[1], ['total', 'untranslated', 'rejected', 'needswork', 'translated', 'approved']);
      const counts = mapValues(msgStatsStr, (numStr) => parseInt(numStr, 10));

      return updateObject(
          state, {
            context: {
              projectVersion: {
                project: {
                  slug: {
                    $set: projectSlug
                  }
                },
                version: {
                  $set: versionSlug
                },
                url: {
                  $set: projectPage(projectSlug, versionSlug)
                }

              },
              selectedDoc: {
                counts: {
                  $set: counts
                }

              }
            }
          }
      );

    case MY_INFO_FETCHED:
      return updateObject(state, {
        user: {
          name: {
            $set: action.data.name
          },
          gravatarUrl: {
            $set: `http://www.gravatar.com/avatar/${action.data.gravatarHash}?d=mm&ampr=g&amps=${72}`
          },
          dashboardUrl: {
            // FIXME pahuang dashboard url
            $set: `http://localhost:8080/zanata/dashboard`
          }

        }
      });

    case PROJECT_INFO_FETCHED:
      //const projectId = action.data.id;
      const projectName = action.data.name;
      return updateObject(state, {
        context: {
          projectVersion: {
            project: {
              name: {
                $set: projectName
              }
            }
          }
        }

      });

    case DOCUMENT_SELECTED:
      return updateObject(state, {
        context: {
          selectedDoc: {
            id: {
              $set: action.data
            }
          }
        }
      });

    default:
      return state
  }
}

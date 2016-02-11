import { DOCUMENT_SELECTED, HEADER_DATA_FETCHED, LOCALE_SELECTED, STATS_FETCHED } from '../actions/headerActions'
import updateObject from 'react-addons-update'
import {prepareLocales, prepareStats, prepareDocs} from '../utils/Util'

const defaultState = {
  user: {
    name: '',
    gravatarUrl: '',
    dashboardUrl: ''
  },
  context: {
    projectVersion: {
      project: {
        slug: '',
        name: ''
      },
      version: '',
      url: '',
      docs: [],
      locales: {}
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
    selectedLocale: ''
  }
};

const projectPage = (projectSlug, versionSlug) => {
  // TODO pahuang set server context path
  const serverContextPath = '';
  return `${serverContextPath}iteration/view/${projectSlug}/${versionSlug}`
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case HEADER_DATA_FETCHED:
      const docs = prepareDocs(action.data.documents);
      const locales = prepareLocales(action.data.locales);
      const versionSlug = action.data.versionSlug;
      const projectSlug = action.data.projectInfo.id;
      const projectName = action.data.projectInfo.name;
      const name = action.data.myInfo.name;
      const gravatarHash = action.data.myInfo.gravatarHash;

      return updateObject(state, {
        user: {
          name: {
            $set: name
          },
          gravatarUrl: {
            $set: `http://www.gravatar.com/avatar/${gravatarHash}?d=mm&ampr=g&amps=${72}`
          },
          dashboardUrl: {
            // FIXME pahuang dashboard url
            $set: `http://localhost:8080/zanata/dashboard`
          }

        },
        context: {
          projectVersion: {
            project: {
              slug: {
                $set: projectSlug
              },
              name: {
                $set: projectName
              }
            },
            version: {
              $set: versionSlug
            },
            url: {
              $set: projectPage(projectSlug, versionSlug)
            },
            docs: {
              $set: docs
            },
            locales: {
              $set: locales
            }
          }
        }
      });

    case DOCUMENT_SELECTED:

      return updateObject(state, {
        context: {
          selectedDoc: {
            id: {
              $set: action.data.selectedDocId
            }
          }
        }
      });

    case LOCALE_SELECTED:
      return updateObject(state, {
        context: {
          selectedLocale: {
            $set: action.data.selectedLocaleId
          }
        }
      });

    case STATS_FETCHED:
      const counts = prepareStats(action.data);
      return updateObject(state, {
        context: {
          selectedDoc: {
            counts: {
              $set: counts
            }
          }
        }
      });

    default:
      return state
  }
}

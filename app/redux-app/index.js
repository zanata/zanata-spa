import React from 'react'
import ReactDOM from 'react-dom'
import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { hashHistory, Router, Route } from 'react-router'
import { syncHistory, routeReducer } from 'redux-simple-router'

import Zanata from './Zanata.jsx'
import Project from './Project.jsx'

/**
 * Top level of the Zanata editor app.
 *
 * Responsible for:-
 *  - creating the redux store
 *  - binding the redux store to a React component tree
 *  - rendering the React component tree to the page
 */

const phraseReducer = (state, action) => {
  // FIXME does nothing so far
  return state || "seriously dude"
}

// FIXME why is there no 'phrases'
const reducer = combineReducers({
  routing: routeReducer,
  phrases: phraseReducer
})

// example uses createHistory, but the latest bundles history with react-router
// and has some defaults, so now I am just using one of those.
// const history = createHistory()
const history = hashHistory

const reduxRouterMiddleware = syncHistory(history)
const createStoreWithMiddleware =
  applyMiddleware(reduxRouterMiddleware)(createStore)

const store = createStoreWithMiddleware(reducer)

// this is shown in the example, but listenForReplays is undefined here so
// I will leave it out for now
// reduxRouterMiddleware.listenForReplays(store)

const rootElement = document.getElementById('appRoot')

// FIXME current (old) behaviour when not enough params are specified is to
//       reset to blank app and not even keep the project/version part of the
//       URL. As soon as it has the /translate part of the URL it grabs the
//       first doc and language in the list and goes ahead.
//   Should be able to do better than that.

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Zanata}>
        {/* FIXME use different components when not enough info for editor is
                  shown, for now just indicate what is missing but later they
                  should fetch lists of projects/versions/whatever */}
        <Route path=":projectSlug" component={Project}>
        {/*
          <Route path=":versionSlug" component={Zanata}>
            <Route path="translate" component={Zanata}>
              <Route path=":docId/:lang" component={Zanata}/>
            </Route>
          </Route>
        */}
        </Route>
      </Route>
    </Router>
  </Provider>, rootElement)

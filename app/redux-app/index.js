import React from 'react'
import ReactDOM from 'react-dom'
import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { hashHistory, Router, Route } from 'react-router'
import { syncHistory } from 'redux-simple-router'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './reducers'

import Zanata from './Zanata.jsx'
import NeedSlugMessage from './NeedSlugMessage.jsx'

/**
 * Top level of the Zanata editor app.
 *
 * Responsible for:-
 *  - creating the redux store
 *  - binding the redux store to a React component tree
 *  - rendering the React component tree to the page
 */

// example uses createHistory, but the latest bundles history with react-router
// and has some defaults, so now I am just using one of those.
// const history = createHistory()
const history = hashHistory

const reduxRouterMiddleware = syncHistory(history)
const createStoreWithMiddleware =
  applyMiddleware(
    reduxRouterMiddleware,
    thunk,
    createLogger()
  )(createStore)

const store = createStoreWithMiddleware(rootReducer)

// this is shown in the example, but listenForReplays is undefined here so
// I will leave it out for now
reduxRouterMiddleware.listenForReplays(store)

const rootElement = document.getElementById('appRoot')

// FIXME current (old) behaviour when not enough params are specified is to
//       reset to blank app and not even keep the project/version part of the
//       URL. As soon as it has the /translate part of the URL it grabs the
//       first doc and language in the list and goes ahead.
//   Should be able to do better than that.

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route
        path="/:projectSlug/:versionSlug/translate(/:docId/:lang)"
        component={Zanata}/>
      <Route path="/*" component={NeedSlugMessage}/>
    </Router>
  </Provider>, rootElement)

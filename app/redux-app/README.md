
To start the webpack dev server (with fake-zanata-server):

```
cd zanata-spa
make fakeredux
```


The old Angular app is  `zanata-spa/app`
The new redux app is in `zanata-spa/app/redux-app`
  (it will be moved to replace zanata-spa/app when it is ready)


# Old Angular app structure

Most of the code is in `app/components` and `app/editor`
The top level templates and things are in `app/editor`

There are 3 redux apps making up the UI:

 - `EditorHeader`
 - `MainContent` (I am migrating this now)
 - `SuggestionsPanel` (do this last, it needs some of the actions from MainContent)

find these in `app/components`.

Each has a directive that is responsible for the redux app, and gets data and
events from the Angular app they live in (so a lot of the data is still in
Angular services).

The reducers for the angular apps are in `app/util/reducers` and the actions
are defined either in the directive itself or in `app/util/actions`


# New Redux app structure

All code is within `app/redux-app`

Entry point is `index.js` (where Redux store is instantiated and Root container
render is started).

- `containers` holds the top level components that do the UI layout.
- `components` holds the smaller reusable components.

- `actions` defines all the actions, imported as needed to components
- `api` has all the REST calls, and the functions defined here are usually used
        in async actions (using redux-thunk-middleware)
- reducers are in `reducers` and combined to a single top-level reducer in
  `reducers/index.js`. They are using React immutability helpers to provide
  the `update()` function

There is some stuff in `index.js` and `containers/Root` that sorts out routing
and connecting the redux provider etc. - this should not need any changes for now.

# Migration process

 - Copy the top-level component from one of the 3 Angular directives
   (e.g. EditorHeader) and put it in `containers` and change to a `.js` extension
   (it is all es6 now so no need to distinguish it)
 - Import the component to `containers/Root` and add it to the final render there
   (no need for props, react-redux `connect` will handle that)
 - There will be build errors for missing components: copy each of them to
   `containers` of `components` and update the import statement. Some components
   are probably already there, so just the import statement needs fixing.
 - The rest of the task is making sure the right data is in the redux store,
   and making sure it is passed to the components properly:
     - if data is missing, add the api calls and actions to fetch it
     - if data is present but in a different structure, change it in `mapStateToProps`
     - for action functions, define actions and import them, then use
       `mapDispatchToProps` to generate an action-dispatching function for the
       component.

# How stuff gets from the redux store to components

Some components are "connected", meaning they use the `connect` function - it
works with the `<Provider>` component to link the store to components near the
top of the component tree.

When I define my `Foo` component I connect it like:

`export default connect(mapStateToProps, mapDispatchToProps)(Foo)`

This will merge the objects that those two functions generate into whatever props
are passed to the component from its parent, to give the final props object the
component sees.

Google those functions for more info.

import { configure } from '@kadira/storybook'
import './storybook.css'

// fonts are includes in index.html for the app, but storybook does not use that
var fontLink = document.createElement('link')
fontLink.setAttribute('href', 'http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,400italic') // eslint-disable-line max-len
fontLink.setAttribute('rel', 'stylesheet')
fontLink.setAttribute('type', 'text/css')
fontLink.setAttribute('async', '')
document.getElementsByTagName('head')[0].appendChild(fontLink)

// FIXME need to get the icon svg into the document too

function loadStories () {
  require('../app/redux-app/components/stories/Button')
  require('../app/redux-app/components/stories/Icon')
}

configure(loadStories, module)

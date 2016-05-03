HASGULP := $(shell which gulp)
HASBOWER := $(shell which bower)

checkgulp:
ifndef HASGULP
	$(info Gulp is not installed globally)
	sudo npm -g install gulp
endif

checkbower:
ifndef HASBOWER
	$(info Bower is not installed globally)
	sudo npm -g install bower
endif

setup: checkgulp checkbower
	bower install
	npm install

watch:
	gulp watch

fakeserver:
	cd node_modules/fake-zanata-server && npm start

# Genuine Bolex, a fraction of the normal price.
fakewatch:
	${MAKE} -j2 watch fakeserver

# run the app on a local development server, automatically rebuild and refresh
# when the code changes.
devserver:
	cd app/redux-app && webpack-dev-server -d --progress --inline --hot

# build the css and javascript bundles using webpack
# files end up in /app/redux-app/build (app.css, bundle.js)
webpack:
	cd app/redux-app && webpack --progress

# run the editor on a local server with hot-reload, using API data from a fake
# server.
fakeredux:
	${MAKE} -j2 devserver fakeserver

# run react-storybook server for development and testing of React components
storybook:
	npm run storybook

# build a static version of the React component storybook in /storybook-static
# (will not display properly from file:// url since it has an iframe)
storybook-static:
	npm run build-storybook

test:
	npm test

build:
	NODE_ENV=production gulp build

.PHONY: test build

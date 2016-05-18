HASGULP := $(shell which gulp)

checkgulp:
ifndef HASGULP
	$(info Gulp is not installed globally)
	sudo npm -g install gulp
endif

setup: checkgulp
	npm install

fakeserver:
	cd node_modules/fake-zanata-server && npm start

# run the app on a local development server, automatically rebuild and refresh
# when the code changes (sprites are only built at the beginning).
watch: spritesheet
	cd app && webpack-dev-server -d --progress --inline --hot --content-base build/

# run a local development server backed by a fake Zanata server
watch-fakeserver:
	${MAKE} -j2 watch fakeserver

# build and inject an icon spritesheet into index.html, which is placed in the
# build folder. The spritesheet combines all the individual sprites in
# app/components/icons/images
spritesheet:
	npm run spritesheet

# like spritesheet, but makes a static file that can be used in the storybook
# rather than injecting the spritesheet into the index file.
storybook-spritesheet:
	npm run storybook-spritesheet

# run react-storybook server for development and testing of React components
storybook: storybook-spritesheet
	npm run storybook

# try to build a static version of the React component storybook
#  - outputs to /storybook-static
#  - will not display properly from file:// url since it uses an iframe
#  - includes everything from /app/build even though it does not need
#    it all (only needs icons.svg at this point). Not worth the extra complexity
#    to prevent that.
storybook-static: storybook-spritesheet
	npm run build-storybook

# build the css and javascript bundles using webpack
# files end up in /app/build (app.css, bundle.js)
build: spritesheet
	cd app && NODE_ENV=production webpack --progress

test:
	npm test

.PHONY: test build

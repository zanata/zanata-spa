HASGULP := $(shell which gulp)
HASBOWER := $(shell which bower)
HAS_N := $(shell which n)
NODE_VERSION := $(shell cat '.node-version')


check_n:
ifndef HAS_N
	$(info n is not installed.)
	$(info n is used to switch to the correct version of node.)
	curl -L http://git.io/n-install | bash
endif

node: check_n
	n $(NODE_VERSION)

checkgulp: node
ifndef HASGULP
	$(info Gulp is not installed globally)
	npm -g install gulp
endif

checkbower: node
ifndef HASBOWER
	$(info Bower is not installed globally)
	npm -g install bower
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

test:
	npm test

build:
	NODE_ENV=production gulp build

.PHONY: test build

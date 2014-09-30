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

build:
	NODE_ENV=production gulp build

.PHONY: build

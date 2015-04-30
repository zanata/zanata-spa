# Zanata (Single Page Application)



## Setup and Deployment

1. Make sure [node and npm](http://nodejs.org/) are installed.
2. Setup dependencies: `npm run setup`.

### Run with live reload

Build and run a server: `npm run watch`.

 - Editor is available at [localhost:8000](http://localhost:8000)
 - Assumes a server is already serving the Zanata REST API.


### Run with live reload and local API server

Build and run server and API server: `npm run fakewatch`.

 - Editor is available at [localhost:8000](http://localhost:8000)
   - URL for a working document from the default API server [Tiny Project 1, hello.txt to French](http://localhost:8000/#/tiny-project/1/translate/hello.txt/fr)
 - REST API server is available at
   [localhost:7878/zanata/rest](http://localhost:7878/zanata/rest)


## Code Guidelines

### Javascript/Angular

Stick very closely to [these Angular guidelines](https://github.com/zanata/angularjs-styleguide).

And [these](https://github.com/zanata/javascript) for Javascript.

Always add documentation and follow the [ngdoc format](https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation).

### CSS

For CSS I am aiming to move to [these guidelines](https://github.com/suitcss/suit/blob/master/doc/README.md).

For now, CSS still lives in [Zanata Assets](https://github.com/zanata/zanata-assets).

## License

Zanata is Free software, licensed under the [LGPL](http://www.gnu.org/licenses/lgpl-2.1.html).

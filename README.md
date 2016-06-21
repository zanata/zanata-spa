# Zanata (Single Page Application)



## Setup and Deployment

1. Make sure [node and npm](http://nodejs.org/) are installed.
2. Setup dependencies: `npm install`.

### Run with live reload

Build and run a server: `make build`.

 - Editor is available at [localhost:8080](http://localhost:8080)
   - the editor will be blank at the base URL, include the project-version to
     show content. The format is
     localhost:8080/#/{project-slug}/{version-slug}/translate
 - Assumes a server is already serving the Zanata REST API.


### Run with live reload and local API server

Build and run server and API server: `npm run watch`.

 - Editor is available at [localhost:8080](http://localhost:8080)
   - URL for a working document from the default API server [Tiny Project 1, hello.txt to French](http://localhost:8080/#/tiny-project/1/translate/hello.txt/fr)
 - REST API server is available at
   [localhost:7878/zanata/rest](http://localhost:7878/zanata/rest)


## Running tests

Run tests with `make test` or `npm test` (they do exactly the same thing).


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

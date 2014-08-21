'use strict';

(function () {

/**
 * @name AppCtrl
 * @description Main controler for the entire app
 * @ngInject
 */
function AppCtrl (UserService) {
  this.settings = UserService.settings;
}

angular
  .module('app')
  .controller('AppCtrl', AppCtrl);

})();

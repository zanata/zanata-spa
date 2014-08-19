(function () {

/**
 * MainCtrl.js
 * @ngInject
 */
function MainCtrl (UserService) {
  this.settings = UserService.settings;
}

angular
  .module('app')
  .controller('MainCtrl', MainCtrl);

})();

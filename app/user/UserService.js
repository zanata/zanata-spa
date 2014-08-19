(function () {

/**
 * UserService.js
 */
function UserService () {
  var UserService = {};
  UserService.settings = {
    editor: {
      hideMainNav: false
    }
  }
  return UserService;
}

angular
  .module('app')
  .factory('UserService', UserService);

})();

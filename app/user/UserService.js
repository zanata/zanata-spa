(function () {

/**
 * UserService.js
 */
function UserService () {
  var UserService = {};

  var isLoggedIn = true;
  var username, apiToken;

  UserService.settings = {
    editor: {
      hideMainNav: false
    }
  },

  UserService.login = function(username, apiToken) {
    //perform login to server, if true, set username, password and token
    if(isLoggedIn) {
      this.username = username;
      this.apiToken = apiToken;
    }
  }

  return UserService;
}

angular
  .module('app')
  .factory('UserService', UserService);

})();

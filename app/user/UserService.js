'use strict';

(function () {

/**
 * UserService.js
 */
function UserService () {

  var userService = {};

  userService.settings = {
    editor: {
      hideMainNav: false
    }
  };

  userService.isLoggedIn = true;

  userService.login = function(username, apiToken) {
    //perform login to server, if true, set username, password and token
    if(isLoggedIn) {
      userService.username = username;
      userService.apiToken = apiToken;
    }
  }

  return userService;

}

angular
  .module('app')
  .factory('UserService', UserService);

})();

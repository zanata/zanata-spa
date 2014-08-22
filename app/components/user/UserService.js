(function () {
  'use strict';

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
    //perform login to server, if true, set username and token
    if(userService.isLoggedIn) {
      userService.username = username;
      userService.apiToken = apiToken;
    }
  };

  return userService;

}

angular
  .module('app')
  .factory('UserService', UserService);

})();

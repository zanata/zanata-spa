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
  return userService;
}

angular
  .module('app')
  .factory('UserService', UserService);

})();

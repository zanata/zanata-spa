(function() {
  'use strict';

  /**
   * UserService.js
   */
  function UserService() {
    return {
      settings: {
        editor: {
          hideMainNav: false
        }
      },

      editorContext: function(projectSlug, versionSlug, document,
                              locale, mode) {
        return {
          projectSlug: projectSlug,
          versionSlug: versionSlug,
          document: document,
          locale: locale,
          mode: mode // READ_WRITE, READ_ONLY, REVIEW
        };
      },

      //TODO: Get from server (get current logged in user information)
      getUserInfo : function() {
        return {
          username : 'username',
          email : 'test@zanata.org',
          gravatarHash : 'fd8eefdca68e2044a7680d7a0cf574d7'
        };
      }
    };
  }
  angular.module('app').factory('UserService', UserService);
})();

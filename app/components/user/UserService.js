(function() {
  'use strict';

  /**
   * UserService.js
   */
  function UserService($resource, UrlService) {

    function getUserInfo(username) {
      var UserInfo = $resource(UrlService.USER_INFO_URL, {}, {
        query : {
          method : 'GET',
          params : {
            username : username
          }
        }
      });
      return UserInfo.query().$promise;
    }

    function getMyInfo() {
      var MyInfo = $resource(UrlService.MY_INFO_URL, {}, {
        query : {
          method : 'GET'
        }
      });
      return MyInfo.query().$promise;
    }

    return {
      settings: {
        editor: {
          hideMainNav: false
        }
      },

      editorContext: function(projectSlug, versionSlug, document,
                              srcLocale, locale, mode) {
        return {
          projectSlug: projectSlug,
          versionSlug: versionSlug,
          document: document,
          srcLocale: srcLocale,
          locale: locale,
          mode: mode // READ_WRITE, READ_ONLY, REVIEW
        };
      },
      getUserInfo : getUserInfo,
      getMyInfo : getMyInfo
    };
  }
  angular
    .module('app')
    .factory('UserService', UserService);
})();

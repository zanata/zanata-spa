(function() {
  'use strict';

  /**
   * Utility to handles URL related request.
   *
   * UrlService.js
   * @ngInject
   */
  function UrlService($location, $http, $q, $stateParams, _) {
    //IE doesn't support location.origin
    if (!location.origin) {
      location.origin =
        window.location.protocol + '//' + window.location.hostname +
        (window.location.port ? (':' + window.location.port) : '');
    }

    var urlService = this,
      gravatarBaseUrl = 'http://www.gravatar.com/avatar',
      configFile = 'config.json',
      baseUrl = '',
      urls = {},
      uiTranslationsURL = location.origin + location.pathname +
        'translations';

    urlService.serverContextPath = '';

    urlService.init = function () {
      if (baseUrl) {
        return $q.when(baseUrl);
      }
      else {
        /**
         * Temporary solution to handle dynamic context path deployed for
         * Zanata server in JBOSS (/ or /zanata).
         *
         * If config.baseUrl exist and not empty,
         * baseUrl = config.baseUrl
         *
         * ELSE
         * baseUrl = full.url - appPath onwards
         */
        return $http.get(configFile).then(function (response) {
          var config = response.data;
          if (config.baseUrl) {
            baseUrl = config.baseUrl;
          } else {
            var deployPath = config.appPath.replace(/^\//g, ''),
              index = location.href.indexOf(deployPath);

            urlService.serverContextPath = location.origin + location.pathname;
            if(index >= 0) {
              urlService.serverContextPath = location.href.substring(0, index);
            }
            urlService.serverContextPath = urlService.serverContextPath.
              replace(/\/?$/, '/');
            baseUrl = urlService.serverContextPath + 'rest';
          }

          /* jshint -W101 */
          /* eslint-disable max-len */
          // URLs over multiple lines are hard to read, allowing long lines here.
          // Warnings for jshint are turned off/on with -/+ before the warning code.
          // See: https://github.com/jshint/jshint/blob/2.1.4/src/shared/messages.js
          urls = _.mapValues({
            project: '/project/:projectSlug',
            docs: '/project/:projectSlug/version/:versionSlug/docs',
            locales: '/project/:projectSlug/version/:versionSlug/locales',
            status: '/project/:projectSlug/version/:versionSlug/doc/:docId/status/:localeId',
            textFlows: '/source+trans/:localeId',
            docStats: '/stats/project/:projectSlug/version/:versionSlug/doc/:docId/locale/:localeId',
            myInfo: '/user',
            userInfo: '/user/:username',
            translation: '/trans/:localeId',
            allLocales: '/locales',
            suggestions: '/suggestions'
          }, unary(restUrl));
          /* eslint-enable max-len */
          /* jshint +W101 */

          urlService.PROJECT_URL = urls.project;
          urlService.LOCALE_LIST_URL = urls.locales;
          urlService.DOCUMENT_LIST_URL = urls.docs;
          urlService.TRANSLATION_STATUS_URL = urls.status;
          urlService.TEXT_FLOWS_URL = urls.textFlows;
          urlService.DOC_STATISTIC_URL = urls.docStats;
          urlService.MY_INFO_URL = urls.myInfo;
          urlService.USER_INFO_URL = urls.userInfo;
          urlService.TRANSLATION_URL = urls.translation;
          urlService.ALL_LOCALE_URL = urls.allLocales;
          urlService.SUGGESTIONS_URL = urls.suggestions;

          urlService.projectPage = function(projectSlug, versionSlug) {
            return urlService.serverContextPath + 'iteration/view/' +
              projectSlug + '/' + versionSlug;
          };

          urlService.DASHBOARD_PAGE = urlService.serverContextPath +
            'dashboard';
        });
      }
    };

    /**
     * Get the value of a query string parameter.
     */
    urlService.readValue = function (key) {
      return $location.search()[key];
    };

    urlService.gravatarUrl = function (gravatarHash, size) {
      return gravatarBaseUrl + '/' + gravatarHash +
        '?d=mm&amp;r=g&amp;s=' + size;
    };

    urlService.uiTranslationURL = function (locale) {
      return uiTranslationsURL + '/' + locale + '.json';
    };

    urlService.uiTranslationListURL = uiTranslationsURL + '/locales';

    return urlService;

    /**
     * Create a REST URL by appending all the given URL part arguments to the
     * base URL.
     *
     * No separators will be added or removed, so all parts should include
     * leading / and exclude trailing / to avoid problems.
     */
    function restUrl() {
      return baseUrl + Array.prototype.join.call(arguments, '');
    }

    /**
     * Decorate a function to ignore all but the first argument.
     */
    function unary(fun) {
      return function(arg) {
        return fun(arg);
      };
    }
  }

  angular
    .module('app')
    .factory('UrlService', UrlService);
})();

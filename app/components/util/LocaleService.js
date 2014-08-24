
(function() {
    'use strict';

    /**
     * LocaleService.js
     * @ngInject
     */
    function LocaleService($q, $resource, UrlService) {
        var localeService = {},
        localeRestUrl = UrlService.constructRestUrl(
          'rest/projects/p/:projectSlug/iterations/i/:versionSlug/locales/l');

        localeService.getSupportedLocales = function(_projectSlug,
                                                     _versionSlug) {
            var deferred = $q.defer(),
                locales;

            locales =
                $resource(localeRestUrl, {}, {
                    query: {
                        method: 'GET',
                        params: {
                            projectSlug: _projectSlug,
                            versionSlug: _versionSlug
                        },
                        isArray: true
                    }
                });

            deferred.resolve(locales.query());
            return deferred.promise;
        } ;


        return localeService;
    }

    angular.module('app').factory('LocaleService', LocaleService);
})();

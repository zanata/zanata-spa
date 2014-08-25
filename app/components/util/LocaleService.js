
(function() {
    'use strict';

    /**
     * LocaleService.js
     * @ngInject
     */
    function LocaleService($q, $resource, UrlService) {
        var localeService = {};

        localeService.getSupportedLocales = function(_projectSlug,
                                                     _versionSlug) {
            var deferred = $q.defer(),
                locales;

            locales =
                $resource(UrlService.getLocaleListUrl(), {}, {
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

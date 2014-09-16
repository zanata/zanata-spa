(function() {
  'use strict';

  function FilterUtil(StringUtil) {

    /**
     * Filter in resources on given fields with matched terms
     *
     * @param resources - list of resources
     * @param fields - list of fields to check
     * @param terms - list of term to check
     * @returns {*}
     */
    function filterResources(resources, fields, terms) {
      if(!resources || !fields || !terms) {
        return resources;
      }
      var filteredResources = [];

      resources.forEach(function (resource) {
        fields.forEach(function (field) {
          terms.forEach(function (term) {
            if(isInclude(resource, field, term)) {
              filteredResources.push(resource);
            }
          });
        });
      });
      return filteredResources;
    }

    function isInclude(resource, field, term) {
      if(!resource || !field || !term) {
        return false;
      }
      return StringUtil.equals(resource[field], term, true);
    }

    return {
      filterResources : filterResources
    };
  }
  angular
    .module('app')
    .factory('FilterUtil', FilterUtil);
})();

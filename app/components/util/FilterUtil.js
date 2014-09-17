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
        if(isInclude(resource, fields, terms)) {
          filteredResources.push(resource);
        }
      });
      return filteredResources;
    }

    function isInclude(resource, fields, terms) {
      if(!resource || !fields || !terms) {
        return false;
      }
      fields.forEach(function (field) {
        terms.forEach(function (term) {
          if(StringUtil.equals(resource[field], term, true)) {
            return true;
          }
        });
      });
      return false;
    }

    return {
      filterResources : filterResources
    };
  }
  angular
    .module('app')
    .factory('FilterUtil', FilterUtil);
})();

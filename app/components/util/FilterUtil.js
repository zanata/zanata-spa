(function() {
  'use strict';

  function FilterUtil(StringUtil, _) {

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
      return _.filter(resources, function (resource) {
        return isInclude(resource, fields, terms);
      });
    }

    function isInclude(resource, fields, terms) {
      if(!resource || !fields || !terms) {
        return false;
      }
      var toInclude = false;
      _.every(fields, function (field) {
        _.every(terms, function (term) {
          if(StringUtil.equals(resource[field], term, true)) {
            toInclude = true;
            return false; //this is the way to break loop in .every
          }
        });
        if(toInclude) {
          return false; //this is the way to break loop in .every
        }
      });
      return toInclude;
    }

    return {
      filterResources : filterResources
    };
  }
  angular
    .module('app')
    .factory('FilterUtil', FilterUtil);
})();

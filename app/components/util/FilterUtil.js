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

    /**
     * Filter out properties starting with $ (added by promise)
     * @param resources
     */
    function cleanResourceMap(resources) {
      var filteredList = {};
      var ids = Object.keys(resources).filter(function (id) {
        return id.indexOf('$') === -1;
      });
      ids.forEach(function(id) {
        filteredList[id] = (resources[id]);
      });
      return filteredList;
    }

    function cleanResourceList(resources) {
      var filteredList = [];
      var ids = Object.keys(resources).filter(function (id) {
        return id.indexOf('$') === -1;
      });
      ids.forEach(function(id) {
        filteredList.push(resources[id]);
      });
      return filteredList;
    }


    function isInclude(resource, fields, terms) {
      if(!resource || !fields || !terms) {
        return false;
      }
      return _.any(fields, function(field) {
        return _.any(terms, function(term) {
          return StringUtil.equals(resource[field], term, true);
        });
      });
    }

    return {
      filterResources  : filterResources,
      cleanResourceList:cleanResourceList,
      cleanResourceMap   : cleanResourceMap
    };
  }
  angular
    .module('app')
    .factory('FilterUtil', FilterUtil);
})();

(function() {
  'use strict';

  function StringUtil() {
    function startsWith(str, prefix, ignoreCase) {
      if (ignoreCase) {
        str = str.toUpperCase();
        prefix = prefix.toUpperCase();
      }
      return str.lastIndexOf(prefix, 0) === 0;
    }

    function endsWith(str, suffix, ignoreCase) {
      if (ignoreCase) {
        str = str.toUpperCase();
        suffix = suffix.toUpperCase();
      }
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function equals(from, to, ignoreCase) {
      if (ignoreCase) {
        from = from.toUpperCase();
        to = to.toUpperCase();
      }
      return from === to;
    }

    return {
      startsWith : startsWith,
      endsWith : endsWith,
      equals : equals
    };
  }
  angular.module('app').factory('StringUtil', StringUtil);
})();

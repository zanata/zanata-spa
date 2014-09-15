(function() {
  'use strict';

  /**
   * Utility method for handling $resource.statistic
   *
   * StatisticUtil.js
   * @ngInject
   *
   */

  function StatisticUtil() {
    return {
      getWordStatistic: function(statistics) {
        return statistics[0].unit === 'WORD' ? statistics[0] : statistics[1];
      },
      getMsgStatistic: function(statistics) {
        return statistics[0].unit === 'MESSAGE' ? statistics[0] : statistics[1];
      }
    };
  }
  angular
    .module('app')
    .factory('StatisticUtil', StatisticUtil);
})();

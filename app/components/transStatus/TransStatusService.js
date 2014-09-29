(function () {
  'use strict';

  /**
   * TransStatusService.js
   *
   * @ngInject
   */
  function TransStatusService(_) {
    var transStatusService = this,
        STATUSES = {
          'UNTRANSLATED': {
            'ID': 'untranslated',
            'NAME': 'Untranslated',
            'CSSCLASS': 'neutral'
          },
          'NEEDSWORK': {
            'ID': 'needswork',
            'NAME': 'Needs Work',
            'CSSCLASS': 'unsure'
          },
          'TRANSLATED' : {
            'ID': 'translated',
            'NAME': 'Translated',
            'CSSCLASS': 'success'
          },
          'APPROVED': {
            'ID': 'approved',
            'NAME': 'Approved',
            'CSSCLASS': 'highlight'
          }
        };

    transStatusService.getAll = function() {
      return STATUSES;
    };

    transStatusService.getAllAsArray = function() {
      return _.values(STATUSES);
    };

    transStatusService.getStatusInfo = function(status) {
      return STATUSES[conformStatus(status)];
    };

    transStatusService.getId = function(status) {
      return STATUSES[conformStatus(status)].ID;
    };

    transStatusService.getName = function(status) {
      return STATUSES[conformStatus(status)].NAME;
    };

    transStatusService.getCSSClass = function(status) {
      return STATUSES[conformStatus(status)].CSSCLASS;
    };

    /**
     * Conform it to upperclass for lookups and
     * temporary fix for server sending "NeedReview"
     * instead of NeedsWork status
     * @param  {string} status
     * @return {string}        new value to use
     */
    function conformStatus(status) {
      status = angular.uppercase(status);
      if (status === 'NEEDREVIEW') {
        status = 'NEEDSWORK';
      }
      return status;
    }

    return transStatusService;
  }

  angular
    .module('app')
    .factory('TransStatusService', TransStatusService);
})();

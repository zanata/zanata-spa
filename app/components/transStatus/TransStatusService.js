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

    transStatusService.getStatusInfo = function(statusKey) {
      return STATUSES[conformStatus(statusKey)];
    };

    transStatusService.getId = function(statusKey) {
      return STATUSES[conformStatus(statusKey)].ID;
    };

    transStatusService.getServerId = function(statusId) {
      return serverStatusId(statusId);
    };

    transStatusService.getName = function(statusKey) {
      return STATUSES[conformStatus(statusKey)].NAME;
    };

    transStatusService.getCSSClass = function(statusKey) {
      return STATUSES[conformStatus(statusKey)].CSSCLASS;
    };

    /**
     * Conform it to uppercase for lookups and
     * temporary fix for server sending "needReview"
     * instead of needswork status
     * @param  {string} status
     * @return {string}        new value to use
     */
    function conformStatus(statusKey) {
      statusKey = angular.uppercase(statusKey);
      if (!statusKey) {
        statusKey = 'UNTRANSLATED';
      } else if (statusKey === 'NEEDREVIEW') {
        statusKey = 'NEEDSWORK';
      }
      return statusKey;
    }

    /**
     * Conform it to PascalCase for lookups and
     * temporary fix for server receiving "needReview"
     * instead of needswork status
     * @param  {string} status
     * @return {string}        new value to use
     */
    function serverStatusId(statusId) {
      statusId =
        statusId.charAt(0).toUpperCase() + statusId.slice(1).toLowerCase();
      console.log(statusId);
      if (!statusId) {
        return 'Untranslated';
      } else if (statusId === 'Needswork') {
        return 'NeedReview';
      }
      return statusId;
    }

    return transStatusService;
  }

  angular
    .module('app')
    .factory('TransStatusService', TransStatusService);
})();

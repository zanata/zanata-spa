(function () {
  'use strict';

  /**
   * @typedef {Object} StatusInfo
   * @property {string} ID lower case translation status (content state)
   * @property {string} NAME capitalized representation
   * @property {string} CSSCLASS css class to use for this status
   *
   */
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

    /**
     *
     * @param {string} statusKey string representation of the status.
     * @returns {StatusInfo}
     */
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
      if (!statusKey || statusKey === 'NEW') {
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
      statusId = angular.lowercase(statusId);
      if (!statusId || statusId === 'untranslated') {
        return 'New';
      } else if (statusId === 'needswork') {
        return 'NeedReview';
      }
      return statusId.charAt(0).toUpperCase() + statusId.slice(1).toLowerCase();
    }

    return transStatusService;
  }

  angular
    .module('app')
    .factory('TransStatusService', TransStatusService);
})();


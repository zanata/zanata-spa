(function() {
  'use strict';

  /**
   * The name of a setting, used as a unique key for lookup and storage.
   * @typedef {string} SettingKey
   */

  /**
   * The value for a setting.
   *
   * @typedef {(string|number|boolean)} SettingValue
   */

  /**
   * Service for persisted user settings.
   *
   * @constructor
   */
  function SettingsService($q, _) {
    var settingsService = this;

    /**
     * All valid settings keys.
     *
     * These enum constants should be used for all settings operations.
     *
     * @enum {SettingKey}
     */
    settingsService.SETTING = {
      SUGGESTIONS_AUTOFILL_ON_ROW_SELECT: 'suggestionsAutofillOnRowSelect',
      SUGGESTIONS_SHOW_DIFFERENCE: 'suggestionsShowDifference'
    };

    var SETTING = settingsService.SETTING;

    /**
     * Settings enum, with default values that indicate the type
     * @enum {SettingValue}
     */
    var defaultSettings = {};
    defaultSettings[SETTING.SUGGESTIONS_AUTOFILL_ON_ROW_SELECT] = true;
    defaultSettings[SETTING.SUGGESTIONS_SHOW_DIFFERENCE] = false;


    /**
     * Local settings cache.
     *
     * @type {Object<SettingKey, SettingValue>}
     */
    var settings = _.clone(defaultSettings);

    /**
     * Throw an error if the setting is not recognized.
     *
     * Unrecognized settings are a developer error and should not be allowed
     * into production code.
     *
     * @param {SettingKey} setting
     */
    function validateSettingKey(setting) {
      if (!_.includes(SETTING, setting)) {
        throw new Error('Invalid setting key: "' + setting + '".');
      }
    }

    /**
     * Throw an error fi the value is not the correct type for the setting.
     *
     * @param {SettingValue} value
     */
    function validateSettingValue(value) {
      switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
          break;
        default:
          throw new Error('Invalid type for setting value: "' + typeof value +
            '".');
      }

    }

    /**
     * Save a setting to the server.
     *
     * @param {SettingKey} setting - Name of setting to update.
     * @param {SettingValue} value - New value to use for setting.
     * @throws if setting key is not recognized or value is not of a valid type
     */
    function save(setting, value) {
      validateSettingKey(setting);
      validateSettingValue(value);
      settings[setting] = value;
      // TODO persist setting to server
    }

    /**
     * Look up a setting from the server (or local cache).
     *
     * @param {SettingKey} setting - Name of the setting to look up.
     * @returns {$promise.<SettingValue>} the current stored setting value.
     */
    function get(setting) {
      validateSettingKey(setting);
      var value = settings[setting];

      // TODO look up setting from server, maybe only look it up if the cache
      //      entry is stale
      // TODO add second param `function (reject) {...}` if there is an error
      //      with lookup
      return $q(function (resolve) {
        setTimeout(function () {
          resolve(value);
        }, 500);
      });
    }

    return {
      save: save,
      get: get
    };
  }

  angular
    .module('app')
    .factory('SettingsService', SettingsService);
})();
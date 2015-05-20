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
  function SettingsService(EventService, $q, $rootScope, _) {
    var settingsService = this;

    /**
     * All valid settings keys.
     *
     * These enum constants should be used for all settings operations.
     *
     * @type {Object<*, SettingKey>}
     */
    settingsService.SETTING = {
      SUGGESTIONS_AUTOFILL_ON_ROW_SELECT: 'suggestionsAutofillOnRowSelect',
      SUGGESTIONS_SHOW_DIFFERENCE: 'suggestionsShowDifference',
      SHOW_SUGGESTIONS: 'showSuggestions',
      SUGGESTIONS_PANEL_HEIGHT: 'suggestionsPanelHeight'
    };

    var SETTING = settingsService.SETTING;

    /**
     * Settings enum, with default values that indicate the type
     * @enum {SettingValue}
     */
    var defaultSettings = {};
    defaultSettings[SETTING.SUGGESTIONS_AUTOFILL_ON_ROW_SELECT] = true;
    defaultSettings[SETTING.SUGGESTIONS_SHOW_DIFFERENCE] = false;
    defaultSettings[SETTING.SHOW_SUGGESTIONS] = true;
    defaultSettings[SETTING.SUGGESTIONS_PANEL_HEIGHT] = '30%';

    /**
     * Local settings cache.
     *
     * @type {Object<SettingKey, SettingValue>}
     */
    var settings = _.clone(defaultSettings);


    /*

     TODO save settings to the server, prefer sending as a batch if possible
     (i.e. when updateAll is used, and future option to ensure only one save
      request at a time and use _.extend to combine all the queued settings
      while waiting).

    */

    /**
     * Update a single setting to have the given value.
     *
     * This will trigger a user setting update event.
     *
     * @param {SettingKey} setting the name of the setting to update
     * @param {SettingValue} value the new value for the setting
     */
    function update(setting, value) {
      validateSettingValue(value);
      var settingObj = {};
      settingObj[setting] = value;
      _.extend(settings, settingObj);

      EventService.emitEvent(EventService.EVENT.USER_SETTING_CHANGED, {
        setting: setting,
        value: value
      });
    }

    /**
     * Update multiple settings from a map of setting names and values.
     *
     * An event is triggered for each setting.
     *
     * @param {Object<SettingKey, SettingValue>} settings
     */
    function updateAll(settings) {
      _.each(settings, function (value, key) {
        update(key, value);
      });
    }

    /**
     * Get the currently stored value for a setting.
     *
     * This should only be used to fetch the initial value or when a setting
     * is used once. To track changes to a setting, subscribe to the
     * USER_SETTING_CHANGED event and check the setting property of the event
     * payload.
     *
     * @param {SettingKey} setting name of the setting to look up
     */
    function get(setting) {
      if (_.has(settings, setting)) {
        return settings[setting];
      }
      // Incorrect key is a programmer error - default should be set for all
      // user settings that are used.
      console.error('Tried to look up setting with unrecognized key: %s',
        setting);
    }

    /**
     * Register an action to perform when a user setting value changes, and get
     * the current value.
     *
     * @param {SettingKey} setting the setting to get and subscribe to
     * @param {function<SettingValue>} callback called with the new value
     * @return {SettingValue} the current value of the setting
     */
    function subscribe(setting, callback) {
      $rootScope.$on(EventService.EVENT.USER_SETTING_CHANGED,
        function (event, data) {
          if (data.setting === setting) {
            callback(data.value);
          }
        });
      return get(setting);
    }

    /**
     * Throw an error if the value is not the correct type for the setting.
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



    return {
      SETTING: SETTING,
      update: update,
      updateAll: updateAll,
      get: get,
      subscribe: subscribe
    };
  }

  angular
    .module('app')
    .factory('SettingsService', SettingsService);
})();

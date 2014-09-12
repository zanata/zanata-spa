(function () {
  'use strict';

  /**
   * @name trans-unit
   * @description transUnit container
   * @ngInject
   */
  function transUnit() {
    return {
      restrict: 'E',
      replace: true,
      required: ['phrase', 'editorContext'],
      scope: {
        phrase: '=',
        editorContext: '='
      },
      controller: 'TransUnitCtrl',
      templateUrl: 'components/transUnit/trans-unit.html'
    };
  }

  /**
   * @name trans-unit-source
   * @description transUnit source container
   * @ngInject
   */
  function transUnitSource() {
    return {
      restrict: 'E',
      replace: true,
      require: '?^transUnit',
      required: ['phrase', 'context', 'selected'],
      scope: {
        phrase: '=',
        context: '=',
        selected: '='
      },
      templateUrl: 'components/transUnit/source/source.html'
    };
  }

  /**
   * @name trans-unit-status
   * @description transUnit status container
   * @ngInject
   */
  function transUnitStatus() {
    return {
      restrict: 'E',
      replace: true,
      require: '?^transUnit',
      required: 'phrase',
      scope: {
        phrase: '='
      },
      templateUrl: 'components/transUnit/tu-status.html'
    };
  }

  /**
   * @name trans-unit-translation
   * @description transUnit translation container
   * @ngInject
   */
  function transUnitTranslation() {
    return {
      restrict: 'E',
      replace: true,
      require: '?^transUnit',
      required: ['phrase', 'context'],
      scope: {
        phrase: '=',
        context: '=',
        selected: '='
      },
      controller: 'TranslationCtrl',
      templateUrl: 'components/transUnit/translation/translation.html'
    };
  }

  angular
    .module('app')
    .directive('transUnit', transUnit)
    .directive('transUnitSource', transUnitSource)
    .directive('transUnitStatus', transUnitStatus)
    .directive('transUnitTranslation', transUnitTranslation);

})();

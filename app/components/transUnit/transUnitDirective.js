(function() {
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
      templateUrl: 'components/transUnit/transUnit.html'
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
      required: ['phrase', 'context'],
      scope: {
        phrase: '=',
        context: '='
      },
      templateUrl: 'components/transUnit/tu-source.html'
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
      required: ['phrase', 'context'],
      scope: {
        phrase: '=',
        context: '='
      },
      templateUrl: 'components/transUnit/tu-translation.html'
    };
  }

  angular
    .module('app')
    .directive('transUnit', transUnit)
    .directive('transUnitSource', transUnitSource)
    .directive('transUnitStatus', transUnitStatus)
    .directive('transUnitTranslation', transUnitTranslation);

})();

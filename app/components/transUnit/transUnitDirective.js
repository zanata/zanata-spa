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
      required: ['phrase', 'editorContext'],
      scope: {
        phrase: '=',
        firstPhrase: '=',
        editorContext: '='
      },
      controller: 'TransUnitCtrl as transUnitCtrl',
      templateUrl: 'components/transUnit/trans-unit.html',
      link: function(scope, element, attr, TransUnitCtrl) {
        TransUnitCtrl.init();
      }
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
      controller: 'TransUnitCtrl as transUnitCtrl',
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
      controller: 'TransUnitCtrl as transUnitCtrl',
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
      controller: 'TransUnitCtrl as transUnitCtrl',
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

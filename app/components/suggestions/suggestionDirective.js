(function () {
  'use strict'

  /**
   * @name suggestion
   * @description suggestion container
   * @ngInject
   */
  function suggestion () {
    return {
      // Only use the template on elements with this name (not on things that
      // have an attribute or class called 'suggestion'.
      restrict: 'E',
      // required: ['suggestion'],

      // Specify an isolated scope for the suggestion component.
      scope: {
        // make variable 'suggestion' available in the template's scope, and
        // bind its value from the attribute with the same name.
        // (a different name for the attribute can be specified after the =
        suggestion: '=',
        index: '=',
        search: '=',
        diffEnabled: '='

        // If I put & instead of = in front of a name, it will run it in the
        // parent scope instead of this directive's isolated scope. Good for
        // callbacks.
      },
      controller: 'SuggestionCtrl as suggestionCtrl',
      templateUrl: 'components/suggestions/suggestion.html'
    }
  }

  angular
    .module('app')
    .directive('suggestion', suggestion)
})()

(function() {
  'use strict';

  /**
   * @name display-character
   * @description display whitespace character with symbol(HTML),
   *              *NOTE*, need to wrap around <pre> tag
   * @ngInject
   */
  function renderWhitespaceCharacters() {
    var WHITESPACES = {
      'space' : {
        'regex' : / /g,
        'template' : '<span class="u-textSpace"> </span>'
      },
      'newline' : {
        'regex' : /\n/g,
        'template' : '<span class="u-textPilcrow"></span>\n'
      },
      'tab' : {
        'regex' : /\t/g,
        'template' : '<span class="u-textTab">\t</span>'
      }
    };

    return {
      restrict: 'A',
      required: ['ngBind'],
      scope: {
        ngBind: '='
      },

      link: function compile(scope, element) {
        scope.$watch('ngBind', function (value) {
          value = replaceChar(value, WHITESPACES.space);
          value = replaceChar(value, WHITESPACES.newline);
          value = replaceChar(value, WHITESPACES.tab);
          element.html(value);
        });
      }
    };

    function replaceChar(value, whitespaceChar) {
      return value.replace(whitespaceChar.regex, whitespaceChar.template);
    }
  }

  angular
    .module('app')
    .directive('renderWhitespaceCharacters', renderWhitespaceCharacters);

})();

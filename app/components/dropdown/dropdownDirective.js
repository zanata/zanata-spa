(function() {

'use strict';

/**
 * @name dropdownSelect
 * @description Main dropdown container
 * @ngInject
 */

function dropdownSelect($document) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      dropdownSelect: '=',
      dropdownModel: '=',
      dropdownOnchange: '&'
    },
    controller: [
      '$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var body;
        console.log($scope);
        $scope.labelField = $attrs.dropdownItemLabel != null ?
          $attrs.dropdownItemLabel : 'text';
        this.select = function(selected) {
          if (selected !== $scope.dropdownModel) {
            angular.copy(selected, $scope.dropdownModel);
          }
          $scope.dropdownOnchange({
            selected: selected
          });
        };
        body = $document.find('body');
        body.bind('click', function() {
          $element.removeClass('is-active');
        });
        $element.bind('click', function(event) {
          event.stopPropagation();
          $element.toggleClass('is-active');
        });
      }
    ],
    templateUrl: 'components/dropdown/dropdownSelect.html'
  };
}

/**
 * @name dropdownSelectItem
 * @description Dropdown Select Items
 */

function dropdownSelectItem() {
  return {
    require: '^dropdownSelect',
    replace: true,
    scope: {
      dropdownItemLabel: '=',
      dropdownSelectItem: '='
    },
    link: function(scope, element, attrs, dropdownSelectCtrl) {
      scope.selectItem = function() {
        if (scope.dropdownSelectItem.href) {
          return;
        }
        dropdownSelectCtrl.select(scope.dropdownSelectItem);
      };
    },
    templateUrl: 'components/dropdown/dropdownSelectItem.html'
  };
}

/**
 * @name dropdownMenu
 * @description Dropdown container for menus
 * @ngInject
 */

function dropdownMenu($parse, $compile, $document) {
  var template = '' +
    '<ul class="dropdown">' +
      '<li ng-repeat="item in dropdownMenu"' +
          'class="dropdown-item"' +
          'dropdown-item-label="labelField"' +
          'dropdown-menu-item="item">' +
      '</li>' +
    '</ul>';
  return {
    restrict: 'A',
    replace: false,
    scope: {
      dropdownMenu: '=',
      dropdownModel: '=',
      dropdownOnchange: '&'
    },
    controller: [
      '$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var $template, $wrap, body, tpl;
        $scope.labelField = $attrs.dropdownItemLabel != null ?
          $attrs.dropdownItemLabel : 'text';
        $template = angular.element(template);
        $template.data('$dropdownMenuController', this);
        tpl = $compile($template)($scope);
        $wrap = angular.element('<div class="wrap-dd-menu"></div>');
        $element.replaceWith($wrap);
        $wrap.append($element);
        $wrap.append(tpl);
        this.select = function(selected) {
          if (selected !== $scope.dropdownModel) {
            angular.copy(selected, $scope.dropdownModel);
          }
          $scope.dropdownOnchange({
            selected: selected
          });
        };
        body = $document.find('body');
        body.bind('click', function() {
          tpl.removeClass('active');
        });
        $element.bind('click', function(event) {
          event.stopPropagation();
          tpl.toggleClass('active');
        });
      }
    ]
  };
}


/**
 * @name dropdownMenuItem
 * @description Dropdown Menu Items
 */

function dropdownMenuItem() {
  return {
    require: '^dropdownMenu',
    replace: true,
    scope: {
      dropdownMenuItem: '=',
      dropdownItemLabel: '='
    },
    link: function(scope, element, attrs, dropdownMenuCtrl) {
      scope.selectItem = function() {
        if (scope.dropdownMenuItem.href) {
          return;
        }
        dropdownMenuCtrl.select(scope.dropdownMenuItem);
      };
    },
    templateUrl: 'components/dropdown/dropdownMenuItem.html'
  };
}

angular
  .module('app')
  .directive('dropdownSelect', dropdownSelect)
  .directive('dropdownSelectItem', dropdownSelectItem)
  .directive('dropdownMenu', dropdownMenu)
  .directive('dropdownMenuItem', dropdownMenuItem);

})();

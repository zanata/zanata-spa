(function() {
  'use strict';

  /**
   * Represents a draggable resizer.
   *
   * @param $window
   * @param $document
   * @param $timeout
   * @returns {Function}
   */
  function resizer(SettingsService, $window, $document, $timeout) {

    function link(scope, element, attrs) {

      /**
       * The height to use for the resizer when it is visible.
       *
       * @type {Number}
       */
      scope.height = parseInt(attrs.resizerHeight);

      /**
       * The current height of the resizer to display.
       *
       * @type {Number}
       */
      scope.actualHeight = scope.height;

      scope.position =
        normalisePercentage(attrs.resizerPosition, $window.innerHeight);
      scope.actualPosition = scope.position;

      scope.show =
        SettingsService.subscribe(SettingsService.SETTING.SHOW_SUGGESTIONS,
        function (show) {
          scope.show = show;
          setBottomPanelVisibility(show);
        });

      function setBottomPanelVisibility(showing) {
        if (showing) {
          scope.actualPosition = scope.position;
          scope.actualHeight = scope.height;
        } else {
          // save resizer position so it can be restored
          // does not appear to set properly without an intermediate variable
          var currentPos = scope.actualPosition;
          scope.position = currentPos;
          scope.actualPosition = 0;
          scope.actualHeight = 0;
        }

        // Panel only renders properly if resizer is adjusted in a later frame
        setTimeout(adjustResizer);
      }

      setBottomPanelVisibility(scope.show);

      element.addClass('Resizer');

      // Initial Resize
      if (attrs.resizer === 'vertical') {
        element.addClass('Resizer--vertical');
        $timeout(function (){
          adjustVerticalPanel(scope.actualPosition);
        });
      }
      else {
        element.addClass('Resizer--horizontal');
        $timeout(function (){
          adjustHorizontalPanel(scope.actualPosition);
        });
      }

      element.on('mousedown', function(event) {
        event.preventDefault();
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      angular.element($window).bind('resize', function() {
        $timeout.cancel(scope.resizing);
        scope.resizing = $timeout(adjustResizer);
      });

      function mousemove(event) {
        if (attrs.resizer === 'vertical') {
          adjustVerticalPanel(event.pageX);
        } else {
          adjustHorizontalPanel($window.innerHeight - event.pageY);
        }
      }

      function adjustVerticalPanel(resizerPositionX) {
        var x = resizerPositionX,
            leftPanel = angular.element(document
              .querySelector(attrs.resizerLeft)),
            rightPanel = angular.element(document
              .querySelector(attrs.resizerRight)),
            maximumPanelSize =
              normalisePercentage(attrs.resizerMax, $window.innerHeight),
            minimumPanelSize = attrs.resizerMin ||
              parseInt(attrs.resizerWidth);

        scope.actualPosition = x;
        x = restrictMinOrMax(x, maximumPanelSize, minimumPanelSize);

        element.css({
          left: (x - (scope.actualHeight / 2))  + 'px'
        });

        leftPanel.css({
          width: x + 'px'
        });

        rightPanel.css({
          left: x + 'px'
        });
      }

      function adjustHorizontalPanel(resizerPositionY) {
        var y = resizerPositionY,
            topPanel = angular.element(document
              .querySelector(attrs.resizerTop)),
            bottomPanel = angular.element(document
              .querySelector(attrs.resizerBottom)),
            maximumPanelSize =
              normalisePercentage(attrs.resizerMax, $window.innerHeight),
            minimumPanelSize = attrs.resizerMin || scope.actualHeight;

        scope.actualPosition = y;
        y = restrictMinOrMax(y, maximumPanelSize, minimumPanelSize);

        element.css({
          bottom: (y - (scope.actualHeight / 2))  + 'px'
        });

        topPanel.css({
          bottom: y + 'px'
        });

        bottomPanel.css({
          height: y + 'px'
        });
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }

      function adjustResizer() {
        if (attrs.resizer === 'vertical') {
          adjustVerticalPanel(scope.actualPosition);
        }
        else {
          adjustHorizontalPanel(scope.actualPosition);
        }
      }

      function restrictMinOrMax(currentSize, maxSize, minSize) {
        // Maximum
        if (maxSize && currentSize > maxSize) {
          return maxSize;
        }
        // Minimum
        else if (currentSize < minSize) {
          return minSize;
        }
        else {
          return currentSize;
        }
      }

      function normalisePercentage(fraction, whole) {
        if ((/[0-9]*\.?[0-9]+%/).test(fraction)) {
          return Math.round(whole * (parseInt(fraction.replace('%','')) / 100));
        }
        else {
          return parseInt(fraction);
        }
      }

    }

    return {
      link: link
    };
  }

  angular
    .module('app')
    .directive('resizer', resizer);

})();

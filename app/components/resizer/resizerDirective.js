(function() {
  'use strict';

  function resizer($window, $document, $timeout) {

    return function(scope, element, attrs) {

      var resizerPosition =
            normalisePercentage(attrs.resizerPosition, $window.innerHeight),
          resizing;

      element.addClass('Resizer');

      // Initial Resize
      if (attrs.resizer === 'vertical') {
        element.addClass('Resizer--vertical');
        $timeout(function (){
          adjustVerticalPanel(resizerPosition);
        });
      }
      else {
        element.addClass('Resizer--horizontal');
        $timeout(function (){
          adjustHorizontalPanel(resizerPosition);
        });
      }

      element.on('mousedown', function(event) {
        event.preventDefault();
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      angular.element($window).bind('resize', function() {
        $timeout.cancel(resizing);
        resizing = $timeout(adjustResizer);
      });

      function mousemove(event) {
        if (attrs.resizer === 'vertical') {
          adjustVerticalPanel(event.pageX);
        } else {
          adjustHorizontalPanel($window.innerHeight - event.pageY);
        }
      }

      function adjustVerticalPanel(resizerPositionX) {
        var x = resizerPosition = resizerPositionX,
            leftPanel = angular.element(document
              .querySelector(attrs.resizerLeft)),
            rightPanel = angular.element(document
              .querySelector(attrs.resizerRight)),
            maximumPanelSize =
              normalisePercentage(attrs.resizerMax, $window.innerHeight),
            minimumPanelSize = attrs.resizerMin ||
              parseInt(attrs.resizerWidth);

        x = restrictMinOrMax(x, maximumPanelSize, minimumPanelSize);

        element.css({
          left: (x - (parseInt(attrs.resizerHeight) / 2))  + 'px'
        });

        leftPanel.css({
          width: x + 'px'
        });

        rightPanel.css({
          left: x + 'px'
        });
      }

      function adjustHorizontalPanel(resizerPositionY) {
        var y = resizerPosition = resizerPositionY,
            topPanel = angular.element(document
              .querySelector(attrs.resizerTop)),
            bottomPanel = angular.element(document
              .querySelector(attrs.resizerBottom)),
            maximumPanelSize =
              normalisePercentage(attrs.resizerMax, $window.innerHeight),
            minimumPanelSize = attrs.resizerMin ||
              parseInt(attrs.resizerHeight);

        y = restrictMinOrMax(y, maximumPanelSize, minimumPanelSize);

        element.css({
          bottom: (y - (parseInt(attrs.resizerHeight) / 2))  + 'px'
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
          adjustVerticalPanel(resizerPosition);
        }
        else {
          adjustHorizontalPanel(resizerPosition);
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
          return Math.round(whole *
            (parseInt(fraction.replace('%', '')) / 100));
        }
        else {
          return parseInt(fraction);
        }
      }

    };

  }

  angular
    .module('app')
    .directive('resizer', resizer);

})();

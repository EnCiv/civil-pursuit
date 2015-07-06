/*
 * Adapted from: http://code.google.com/p/gaequery/source/browse/trunk/src/static/scripts/jquery.autogrow-textarea.js
 * Updated from: https://gist.github.com/thomseddon/4703968
 *
 * Works nicely with the following styles:
 * textarea {
 *  resize: none;
 *  transition: 0.05s;
 *  -moz-transition: 0.05s;
 *  -webkit-transition: 0.05s;
 *  -o-transition: 0.05s;
 * }
 *
 * Usage: <textarea auto-grow></textarea>
 */

/* ripped from https://code.google.com/p/gaequery/source/browse/trunk/src/static/scripts/jquery.autogrow-textarea.js */

'use strict';

!(function ($) {
  /*
   * Auto-growing textareas; technique ripped from Facebook
   */

  $.fn.autogrow = function (options) {
    options = $.extend({ threshold: 20 }, options);
    processOptions(options);

    this.filter('textarea').each(function () {
      var $t = $(this),
          minHeight = $t.height(),
          maxHeight = options['max'] || options['x'] * minHeight || 10000;

      var $shadow = $('<div></div>').css({
        position: 'absolute',
        top: -10000,
        left: -10000,
        width: $t.width() - parseInt($t.css('paddingLeft')) - parseInt($t.css('paddingRight')),
        fontSize: $t.css('fontSize'),
        fontFamily: $t.css('fontFamily'),
        lineHeight: $t.css('lineHeight'),
        resize: 'none'
      }).appendTo(document.body);

      var update = function update() {
        var times = function times(string, number) {
          for (var i = 0, r = ''; i < number; i++) r += string;
          return r;
        };

        var val = this.value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;').replace(/\n$/, '<br/>&nbsp;').replace(/\n/g, '<br/>').replace(/\s{2,}/g, function (space) {
          return times('&nbsp;', space.length - 1) + ' ';
        });

        $shadow.html(val);

        var height = $shadow.height();

        if (height < maxHeight) {
          if (options['animate']) {
            $t.stop().animate({ height: Math.max(height + options['threshold'], minHeight) }, options['animate']);
          } else {
            $t.css('height', Math.max(height + options['threshold'], minHeight));
          }
        }
      };

      $t.keyup(update).keydown(update).keypress(update).change(update).change();
    });

    function processOptions(options) {
      options.x = parseInt(options.x);
      options.max = parseInt(options.max);
      options.threshold = parseInt(options.threshold);
    }

    return this;
  };
})(jQuery);

// angular.module('autoGrow', []).directive('autoGrow', function() {
//     return function(scope, element, attr) {
//         var minHeight, paddingLeft, paddingRight, $shadow = null;

//         function createShadow(){

//             minHeight = element[0].offsetHeight;
//             if (minHeight === 0)
//                 return ;
//             paddingLeft = element.css('paddingLeft');
//             paddingRight = element.css('paddingRight');

//             $shadow = angular.element('<div></div>').css({
//                 position: 'absolute',
//                 top: -10000,
//                 left: -10000,
//                 width: element[0].offsetWidth - parseInt(paddingLeft ? paddingLeft : 0, 10) - parseInt(paddingRight ? paddingRight : 0, 10),
//                 fontSize: element.css('fontSize'),
//                 fontFamily: element.css('fontFamily'),
//                 lineHeight: element.css('lineHeight'),
//                 resize: 'none'
//             });
//             angular.element(document.body).append($shadow);

//         }

//         var update = function() {
//             if ($shadow === null)
//                 createShadow();
//             if ($shadow === null)
//                 return ;
//             var times = function(string, number) {
//                 for (var i = 0, r = ''; i < number; i++) {
//                     r += string;
//                 }
//                 return r;
//             };

//             var val = element.val().replace(/</g, '&lt;')
//                 .replace(/>/g, '&gt;')
//                 .replace(/&/g, '&amp;')
//                 .replace(/\n$/, '<br/>&nbsp;')
//                 .replace(/\n/g, '<br/>')
//                 .replace(/\s{2,}/g, function(space) { return times('&nbsp;', space.length - 1) + ' '; });
//             $shadow.html(val);

//             element.css('height', Math.max($shadow[0].offsetHeight + 30, minHeight) + 'px');
//         };

//         element.bind('keyup keydown keypress change focus', update);
//         scope.$watch(attr.ngModel, update);
//         scope.$watch(function () { return element.is(':visible') ; }, update);
//     };
// });
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
angular.module('autoGrow', []).directive('autoGrow', function() {
    return function(scope, element, attr) {
        var minHeight, paddingLeft, paddingRight, $shadow = null;
 
        function createShadow(){
 
            minHeight = element[0].offsetHeight;
            if (minHeight === 0)
                return ;
            paddingLeft = element.css('paddingLeft');
            paddingRight = element.css('paddingRight');
 
            $shadow = angular.element('<div></div>').css({
                position: 'absolute',
                top: -10000,
                left: -10000,
                width: element[0].offsetWidth - parseInt(paddingLeft ? paddingLeft : 0, 10) - parseInt(paddingRight ? paddingRight : 0, 10),
                fontSize: element.css('fontSize'),
                fontFamily: element.css('fontFamily'),
                lineHeight: element.css('lineHeight'),
                resize: 'none'
            });
            angular.element(document.body).append($shadow);
 
        }
 
        var update = function() {
            if ($shadow === null)
                createShadow();
            if ($shadow === null)
                return ;
            var times = function(string, number) {
                for (var i = 0, r = ''; i < number; i++) {
                    r += string;
                }
                return r;
            };
 
            var val = element.val().replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
                .replace(/\n$/, '<br/>&nbsp;')
                .replace(/\n/g, '<br/>')
                .replace(/\s{2,}/g, function(space) { return times('&nbsp;', space.length - 1) + ' '; });
            $shadow.html(val);
 
            element.css('height', Math.max($shadow[0].offsetHeight + 30, minHeight) + 'px');
        };
 
        element.bind('keyup keydown keypress change focus', update);
        scope.$watch(attr.ngModel, update);
        scope.$watch(function () { return element.is(':visible') ; }, update);
    };
});
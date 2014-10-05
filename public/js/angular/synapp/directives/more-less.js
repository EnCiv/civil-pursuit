/**
 * `moreLess` Displays more or less toggle buttons for truncated tex
 * 
 * @module synapp
 * @function directive::more-less
 * @return {AngularDirective}
 * @example
 *    <ANY data-syn-more-less />
 * @author francoisrvespa@gmail.com
*/

module.exports = function () {
  return {
    restrict: 'C',
    link: function ($scope, $elem, $attr) {

      $attr.$observe('ngBind', function (n, o) {
        if ( n && n !== o ) {
          var des = $elem.text();

          var limit = 100;

          if ( des.length > limit ) {
            $elem.text(des.substr(0, limit));

            var more = $('<a href="#">more</a>');
            var less = $('<a href="#">less</a>');

            function _more () {
              more.on('click', function (e) {
                e.preventDefault();
                $elem.text(des);
                $elem.append($('<span> </span>'), less);
                _less();
                return false;
              });
            }

            function _less () {
              less.on('click', function (e) {
                e.preventDefault();
                $elem.text(des.substr(0, limit));
                $elem.append($('<span> </span>'), more);
                _more();
                return false;
              });
            }

            _more();

            $elem.append($('<span> </span>'), more);
          }
        }
      });

    }
  };
};
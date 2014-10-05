/**
 *  **Displays buttons to squeeze/expand long texts**
 *
 *  It actually *observes* `ng-bind` attribute. Once it gets a new non-null value, it uses that as the text to truncate. It checks if text is greater than {@link module:directives/more-less~limit}. If it's not, it does nothing. Else, it truncates the text and append to DOM a "more" button.
 * 
 * @module directives/more-less
 * @prop $scope {q} - scope
 * @prop $attr {q} - attributes
 * @example
 *    <ANY ng-bind="Possibly some long text..." data-syn-more-less>
 * @author francoisrvespa@gmail.com
*/

module.exports = function () {
  return {
    restrict: 'C',
    link: function ($scope, $elem, $attr) {

      $attr.$observe('ngBind', function (n, o) {
        if ( n && n !== o ) {
          var des = $elem.text();

          /** @var limit {number} - Text limit */
          var limit = 100;

          if ( des.length > limit ) {
            $elem.text(des.substr(0, limit));

            var more = $('<a href="#">more</a>');
            var less = $('<a href="#">less</a>');

            /** @function _more */
            function _more () {
              more.on('click', function (e) {
                e.preventDefault();
                $elem.text(des);
                $elem.append($('<span> </span>'), less);
                _less();
                return false;
              });
            }

            /** @function _less */
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
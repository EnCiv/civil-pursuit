/**
 * `shortenFilter` Chops off a string if it exceeds maximum
 * 
 * @module filters/shorten
 * @example
 *    <!-- HTML -->
 *    <ANY ng-bind='"hello" | shortenFilter:3' />
 *    
 *    // JS
 *    var shortened = shortenFilter("hello", 3);
 * @author francoisrvespa@gmail.com
*/

;(function () {

  module.exports = [shortenFilter];

  function shortenFilter () {

    /** @method shorten
     * @param str {string} - the string to shorten
     * @param max {number} - the limit
     * @return {?string}
    */
    function shorten (str, max) {
      if ( str ) {
        return str.substr(0, max);
      }
    };

    return shorten;
  };

})();

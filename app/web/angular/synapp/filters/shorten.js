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

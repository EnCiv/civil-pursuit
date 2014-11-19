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

        max = max || 100;

        if ( str.length < max ) {
          return str;
        }

        if ( /\s/.test(str[max]) ) {
          return str.substr(0, max);
        }

        var right = str.substr(max).split(/\s/);

        return str.substr(0, max) + right[0];
      }
    };

    return shorten;
  };

})();

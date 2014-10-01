module.exports = function () {
  return function (str, max) {
    if ( typeof str === 'string' ) {
      if ( str.length <= max ) {
        return str;
      }
      else {
        return str.substr(0, max);
      }
    }
  };
};
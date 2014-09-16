module.exports = function () {
  return function (str) {
    if ( typeof str === 'string' ) {
      if ( str.length <= 100 ) {
        return str;
      }
      else {
        return str.substr(0, 100) + '...';
      }
    }
  };
};
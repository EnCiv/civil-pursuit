;(function () {

  module.exports = [Find];

  function Find () {
    return function (items, item) {
      if ( items ) {
        return items.filter(function (_item) {
          for ( var key in item ) {
            if ( _item[key] !== item[key] ) {
              return false;
            }
          }
          return true;
        });
      }
    };
  }

})();

;(function () {

  module.exports = [filterItems];

  function filterItems () {
    return function (items, type, parent) {
      if ( items ) {

        var query = {};

        if ( type ) {
          query.type = type;
        }

        if ( parent ) {
          query.parent = parent;
        }

        return items.filter(function (item) {
          for ( var field in query ) {
            if ( item[field] !== query [field] ) {
              return false;
            }
          }
          return true;
        });
      }
    };
  }
})();

module.exports = function () {
  return function (items) {

    var current = [];
    
    if ( Array.isArray(items) && items.length ) {
      
      current.push(items[0]);

      if ( items[1] ) {
        current.push(items[1]);
      }
    }

    return current;
  };
};
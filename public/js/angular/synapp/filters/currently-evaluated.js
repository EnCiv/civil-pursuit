module.exports = function () {
  return function (entries) {

    var current = [];
    
    if ( Array.isArray(entries) && entries.length ) {
      
      current.push(entries[0]);

      if ( entries[1] ) {
        current.push(entries[1]);
      }
    }

    return current;
  };
};
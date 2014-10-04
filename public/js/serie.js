var serie = {
  callbacks: function () {
    // get arguments list in an array

    var callbacks = Array.prototype.slice.call(arguments);

    // if list empty, exit

    if ( ! callbacks.length ) {
      return;
    }

    // get first callback in list

    var callback = callbacks.shift();

    // if callback not a function, exit

    if ( typeof callback !== 'function' ) {
      return;
    }

    // execute callback

    callback(function (error) {

      if ( error ) {
        throw error;
      }

      // if more callbacks, go again

      if ( callbacks.length ) {
        serie.callbacks.apply(this, callbacks);
      }
    }.bind(this));
  }
};
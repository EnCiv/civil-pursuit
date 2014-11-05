;(function () {

  module.exports = [Channel];

  function Channel () {
    return {
      
      _events: {},

      on: function (channel, event, then) {

        if ( ! this._events[channel] ) {
          this._events[channel] = {};
        }

        if ( ! this._events[channel][event] ) {
          this._events[channel][event] = [];
        }

        this._events[channel][event].push(then);
      },

      emit: function (channel, event, message) {

        if ( this._events[channel] && this._events[channel][event] ) {
          this._events[channel][event].forEach(function (then) {
            then(message);
          });
        }
      }
    };
  }
})();

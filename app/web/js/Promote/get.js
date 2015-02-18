! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function get (cb) {
    var promote = this;

    if ( ! this.evaluation ) {

      // Get evaluation via sockets

      app.socket.emit('get evaluation', this.item.item._id);

      app.socket.once('got evaluation', function (evaluation) {
        console.info('got evaluation', evaluation);

        promote.evaluation = evaluation;

        var limit = 5;

        if ( evaluation.items.length < 6 ) {
          limit = evaluation.items.length - 1;

          if ( ! evaluation.limit && evaluation.items.length === 1 ) {
            limit = 1;
          }
        }

        promote.edit('limit', limit);

        promote.edit('cursor', 1);

        promote.edit('left', evaluation.items[0]);

        promote.edit('right', evaluation.items[1]);

        cb();

      });
    }

    else {
      cb();
    }
  }

  module.exports = get;

} ();

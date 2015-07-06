'use strict';

!(function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Stream(file) {

    var stream = ss.createStream();

    // stream.end = function (cb) {
    //   this.on('end', cb);

    //   return this;
    // };

    // stream.error = function (cb) {
    //   this.on('error', cb);

    //   return this;
    // };

    ss(app.socket).emit('upload image', stream, { size: file.size, name: file.name });

    ss.createBlobReadStream(file).pipe(stream);

    return stream;
  }

  module.exports = Stream;
})();
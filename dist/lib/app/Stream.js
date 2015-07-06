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

    ss(synapp.app.socket).emit('upload image', stream, { size: file.size, name: file.name });

    ss.createBlobReadStream(file).pipe(stream);

    return stream;
  }

  module.exports = Stream;
})();
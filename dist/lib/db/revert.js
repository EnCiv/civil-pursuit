'use strict';

!(function () {

  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function revertDB(model, cb) {

    console.log('revert db', model);

    var stream = require('fs').createReadStream('data/' + model + '.js');

    var mongoose = require('mongoose');

    mongoose.connect(process.env.MONGOHQ_URL);

    var Model = require('../../models/' + model);

    console.log('Model found', Model);

    Model.remove(function (error) {
      if (error) throw error;

      console.log('Model emptied');

      stream.on('data', function (data) {
        this.data = this.data || '';
        this.data += data.toString();
      }).on('end', function () {
        var backup = JSON.parse(this.data);

        console.log('Got backup data', backup);

        require('async').each(backup.documents, function (document, done) {
          Model.create(document, function (error, doc) {
            console.log(error && error.stack);
            done(null, doc);
          });
        }, cb);
      });
    });
  }

  module.exports = revertDB;

  if (/revert\.js$/.test(process.argv[1])) {
    revertDB(process.argv[2], console.log.bind(console));
  }
})();
module.exports = function (cb) {
  var domain = require('domain').create();

  if ( typeof cb !== 'function' ) {
    throw error;
  }

  domain.on('error', function (error) {
    cb(error);
  });

  domain.run(function () {
    var mongoose = require('mongoose');

    if ( require('./mongoose').conn ) {
      return cb(null, require('./mongoose').conn);
    }
    console.log('CONNECTING TO ' + process.env.MONGOHQ_URL);
    var conn = mongoose.connect(process.env.MONGOHQ_URL);

    conn.connection.on('error', cb);

    cb(null, conn);
  });
};
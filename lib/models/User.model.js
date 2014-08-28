var domain = require('domain').create();

domain.on('error', function (error) {
  throw error;
});

domain.run(function () {
  var mongoose = require('mongoose');

  var schema = new mongoose.Schema({
    "email": {
      "type": String,
      "required": true,
      "index": {
        "unique": true
      }
    },
    "password": {
      "type": String,
      "required": true
    }
  });

  if ( ! mongoose.connection._readyState ) {
    mongoose.createConnection(process.env.MONGOHQ_URL);
  }

  var model = mongoose.model('User', schema);

  module.exports = model;
});
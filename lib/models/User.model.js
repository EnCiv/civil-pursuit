var domain = require('domain').create();

domain.on('error', function (error) {
  throw error;
});

domain.run(function () {
  var mongoose = require('mongoose');

  var schema = require('./User.schema');

  require('../connectors/mongoose')(domain.intercept(function (conn) {
    var model = mongoose.model('User', schema);

    module.exports = model;
  }));
});
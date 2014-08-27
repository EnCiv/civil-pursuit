var domain = require('domain').create();

domain.on('error', function (error) {
  throw error;
});

domain.run(function () {
  var mongoose = require('mongoose');

  var schema = require('./User.schema');

  schema.path('password').validate(function (v) {
    return ( v.length >= 4 && v.length <= 32 );
  }, 'lenghtError');

  require('../connectors/mongoose')(domain.intercept(function (conn) {
    var model = mongoose.model('User', schema);

    module.exports = model;
  }));
});
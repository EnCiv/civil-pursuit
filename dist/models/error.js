'use strict';

!(function () {

  'use strict';

  var mongoose = require('mongoose');

  var schema = new mongoose.Schema({
    name: String,
    message: String,
    code: String,
    stack: [String],
    debug: Object,
    repair: [mongoose.Schema.Types.Mixed]
  });

  schema.statics.throwError = require('syn/models/Error/statics/throw-error');

  module.exports = mongoose.model('Error', schema);
})();
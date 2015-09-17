'use strict';

!(function () {

  'use strict';

  var mongoose = require('mongoose');

  var findRandom = require('mongoose-simple-random');

  var Schema = mongoose.Schema;

  var TrainingSchema = new Schema({
    element: {
      type: String,
      required: true
    },
    step: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    'in': Boolean,
    click: String,
    wait: Number,
    listen: String
  });

  TrainingSchema.plugin(findRandom);

  module.exports = mongoose.model('Training', TrainingSchema);
})();
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TopicSchema = new Schema({
 "description": String,
 "image": String,
 "heading": String
});

module.exports = mongoose.model('Topic', TopicSchema);

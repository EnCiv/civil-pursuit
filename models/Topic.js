var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TopicSchema = new Schema({
 "description": String,
 "image": String,
 "heading": {
 	"type": String,
 	"index": {
 		"unique": true
 	}
 },
 "slug": {
 	"type": String,
 	"index": {
 		"unique": true
 	}
 }
});

function slugify (str) {
  return str.replace(/\s+/g, '-');
}

TopicSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model('Topic', TopicSchema);

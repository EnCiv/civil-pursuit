var config = require('../config/config.json');

var path = require('path');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Topic = require('./Topic');
var User = require('./User');

// SCHEMA
// ======

var EntrySchema = new Schema({

  // the image body encoded in base64
  
  "image": {
    "type": String
  },

  // the URL title if any
  
  "title": {
    "type": String
  },

  // the URL if any

  "url": {
    "type": String
  },

  // the subject (required)
  
  "subject": {
    "type": String,
    "required": true
  },

  // the description (required)
  
  "description": {
    "type": String,
    "required": true
  },

  // the topic id (reference to Topic, required)
  
  "topic": {
    "type": Schema.Types.ObjectId,
    "ref": "Topic",
    "required": true,
    "index": true
  },

  // the user id (reference to User, required)
  
  "user": {
    "type": Schema.Types.ObjectId,
    "ref": "User",
    "required": true,
    "index": true
  },

  // The number of times entry has been promoted

  "promotions": {
    "type": Number,
    "index": true
  },

  // The number of times entry has been viewed

  "views":  {
    "type": Number,
    "index": true
  },

  // When entry was created

  "created": {
    "type": Date
  },

  // When entry was last edited

  "edited": {
    "type": Date,
    "default": Date.now
  }
});

// PRE SAVE
// ========

EntrySchema.pre('save', function (next) {

  if ( this.isNew ) {
    this.promotions   = 0;
    this.views        = 0;
    this.created      = Date.now();
  }

  if ( ! this.image || this.image.length > 255 ) {
    return next();
  }
  
  var self = this;

/*  require('lwip').open(path.join(config.tmp, this.image), function(err, image){

    if ( error ) {
      return next(error);
    }

    var batch = image.batch();

    var width = image.width();
    var height = image.height();

    if ( width > height ) {
      batch.resize()
    }

  // check err...
  // define a batch of manipulations and save to disk as JPEG:
  image.batch()
    .resize(120)
    .writeFile('output.jpg', function(err){
      // check err...
      // done.
    });

  });*/

  require('fs').readFile(path.join(config.tmp, this.image),
    function (error, data) {
      if ( error ) {
        return next(error);
      }
      self.image = new Buffer(data).toString('base64');
      next();
    });
});

// UPDATE BY ID
// ============

EntrySchema.statics.updateById = function (id, entry, cb) {
  var self = this;

  self.findById(id, function (error, found) {
    if ( error ) {
      return cb(error);
    }

    for ( var field in entry ) {
      found[field] = entry[field];
    }

    found.save(cb);
  });
};

// SAVE FROM UI
// ============

EntrySchema.statics.add = function (entry, cb) {
  var self = this;

  require('async').parallel(
    {
      topic: function (cb) {
        Topic.findOne({ slug: entry.topic }, cb);
      },

      user: function (cb) {
        User.findOne({ email: entry.user }, cb);
      }
    },

    function (error, results) {
      if ( error ) {
        return cb(error);
      }

      if ( ! results.topic ) {
        return cb(new Error('Topic not found'));
      }

      if ( ! results.user ) {
        return cb(new Error('User not found'));
      }

      entry.topic   = results.topic._id;
      entry.user    = results.user._id;

      console.log('adding entry', entry);

      self.create(entry, cb);
    });
};

// FIND USING TOPIC SLUG
// =====================

EntrySchema.statics.findByTopicSlug = function (slug, cb) {
  var self = this;

  Topic.findOne({ slug: slug }, function (error, topic) {
    if ( error ) {
      return cb(error);
    }

    if ( ! topic ) {
      return cb(new Error('Topic not found'));
    }

    self.find({ topic: topic._id })
      .sort({ promotions: -1, views: -1 })
      .exec(cb);
  });
};

// GENERAL FIND
// ============

EntrySchema.statics.get = function (options, cb) {
  var self = this;

  var options = options || {};

  var parallels = {};

  if ( options['topic-slug'] ) {
    parallels.topic = function (cb) {
      Topic.findOne({ slug: options['topic-slug'] }, cb);
    };
  }

  if ( options['user-email'] ) {
    parallels.user = function (cb) {
      User.findOne({ email: options['user-email'] }, cb);
    };
  }

  require('async').parallel(parallels, function (error, results) {
    if ( error ) {
      return cb(error);
    }

    var query = {};

    if ( results.topic ) {
      query.topic = results.topic._id;
    }

    if ( results.user ) {
      query.user = results.user._id;
    }

    self.find(query).sort({ promotions: -1, views: -1 }).exec(cb);
  });
};

// EXPORT
// ======

module.exports = mongoose.model('Entry', EntrySchema);

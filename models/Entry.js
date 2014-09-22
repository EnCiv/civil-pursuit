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

// PRE INIT
// ========

EntrySchema.post( 'init', function() {
  this._original = this.toObject();
});

// PRE SAVE
// ========

EntrySchema.pre('save', function (next) {

  var self = this;

  // If creating, set default values

  if ( this.isNew ) {
    this.promotions   = 0;
    this.views        = 0;
    this.created      = Date.now();
  }

  // If image declared (and in case of editing - if image changed)

  if ( this.image && ( this.isNew ? true : ( this.image !== this._original.image ) )  ) {
    
    var cloudinary = require('cloudinary');
    
    cloudinary.config({ 
      cloud_name      :   config.cloudinary.cloud.name, 
      api_key         :   config.cloudinary.API.key, 
      api_secret      :   config.cloudinary.API.secret 
    });

    return cloudinary.uploader.upload(
      
      path.join(config.tmp, this.image),
      
      function (result) {
        
        self.image = result.url;

        next();

      }      
    );
  
  }

  return next();

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

var config = require('../config/config.json');

var path = require('path');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User    = require('./User');

// SCHEMA
// ======

var ItemSchema = new Schema({

  // the image (link to cloudinary)
  
  "image": {
    "type": String
  },

  // the references

  "references": [
    {
      "url": String,
      "title": String
    }
  ],

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

  // the type of items

  "type": {
    "type": String,
    "required": true,
    "validate": function (type) {
      return ['Topic', 'Problem', 'Solution', 'Opinion'].indexOf(type) > -1;
    }
  },

  // the parent
  
  "parent": {
    "type": Schema.Types.ObjectId,
    "ref": "Item",
    "index": true
  },

  // the user id (reference to User, required)
  
  "user": {
    "type": Schema.Types.ObjectId,
    "ref": "User",
    "required": true,
    "index": true
  },

  // The number of times Item has been promoted

  "promotions": {
    "type": Number,
    "index": true
  },

  // The number of times Item has been viewed

  "views":  {
    "type": Number,
    "index": true
  },

  // When Item was created

  "created": {
    "type": Date
  },

  // When Item was last edited

  "edited": {
    "type": Date,
    "default": Date.now
  }
});

// PRE INIT
// ========

ItemSchema.post( 'init', function() {
  this._original = this.toObject();
});

// PRE SAVE
// ========

ItemSchema.pre('save', function (next) {

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

ItemSchema.statics.updateById = function (id, Item, cb) {
  var self = this;

  self.findById(id, function (error, found) {
    if ( error ) {
      return cb(error);
    }

    for ( var field in Item ) {
      found[field] = Item[field];
    }

    found.save(cb);
  });
};

// SAVE FROM UI
// ============

ItemSchema.statics.add = function (Item, cb) {
  var self = this;

  require('async').parallel(
    {
      topic: function (cb) {
        Topic.findOne({ slug: Item.topic }, cb);
      },

      user: function (cb) {
        User.findOne({ email: Item.user }, cb);
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

      Item.topic   = results.topic._id;
      Item.user    = results.user._id;

      console.log('adding Item', Item);

      self.create(Item, cb);
    });
};

// FIND USING TOPIC SLUG
// =====================

ItemSchema.statics.findByTopicSlug = function (slug, cb) {
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

ItemSchema.statics.get = function (options, cb) {
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

module.exports = mongoose.model('Item', ItemSchema);

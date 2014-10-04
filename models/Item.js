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

// PRE VALIDATE
// ============

ItemSchema.pre('validate', function (next) {
/*  if ( this.isNew && this.parent ) {
    this.parent = Schema.Types.ObjectId(this.parent);
  }*/
  return next();
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

  // If no image, use parent's image (if any)

  if ( this.isNew && ! this.image && this.parent ) {
    return Item.findById(this.parent, 'image',
      function (error, parent) {
        if ( error ) {
          return next(error);
        }

        this.image = parent.image;

        return next();
      }.bind(this));
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

// EVALUATE
// ============

ItemSchema.statics.evaluate = function (id, cb) {
  var self = this;

  this.findById(id, function (error, item) {
    if ( error ) {
      return cb(error);
    }

    if ( ! item ) {
      return cb(new Error('Item not found'));
    }

    require('async').parallel({
      items: function (then) {
        self
          .find({
            type: item.type,
            parent: item.parent
          })

          .where('_id').ne(item._id)

          .limit(5)

          .sort({ views: 1 })

          .exec(then);
      },
      criterias: function (then) {
        require('./Criteria').find({ type: 'Topic'}, then);
      }
    }, function (error, results) {
      cb(error, {
        type: item.type,
        item: id,
        items: results.items.concat(item),
        criterias: results.criterias
      });
    });

  });
};

// DETAILS
// ============

ItemSchema.statics.details = function (id, cb) {
  var self = this;

  require('async').parallel({
      votes: function (then) {
        require('./Vote').find({ item: Schema.Types.ObjectId(id) }, then);
      },

      feedbacks: function (then) {
        require('./Feedback').find({ item: id }, then);
      }
    },

    function (error, results) {
      if ( error ) {
        return cb(error);
      }

      self.findById(id, function (error, item) {
        if ( error ) {
          return cb(error);
        }

        cb(null, {
          item: item,
          votes: results.votes,
          feedbacks: results.feedbacks
        });
      });
    });
};

// EXPORT
// ======

var Item = module.exports = mongoose.model('Item', ItemSchema);

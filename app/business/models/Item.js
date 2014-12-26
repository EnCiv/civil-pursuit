/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                       

         $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$ 
        $$        $$    $$  $$    $$        $$  $$    $$  $$    $$
         $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$
              $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$
        $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$ 
                        $$                      $$        $$      
                        $$                      $$        $$     
                   $$$$$$                       $$        $$                     













                ...._ ..,,-======-.
                  `''<<::   o.      `\
                       `-."      .cdbc`.
                          ;      ?$$$$$b.
                          ;...  .d$$$$$$!>
                        .$$$$$$P"??$$??!!!!>.
                       ,$$$$$$P   .?!!!!!!!!!>
                       $$$$$$$k  !!!!!!!!!!!!!!>
                      d$$$$$$$$   !!!!!!!!!!!!!!:
                     d$$$$$$$$$F '!!!!!!!!!!!!!!!:
                    d$$$$$$$$$$  '!!!!!!!!!!!!!!!!>
                    $$$$$$$$$$$L !!!!!!!!!!!!!!!!!!
                   d$$$$$$$$$$$$ '!!!!!!!!!!!!!!!!!!
                   d$$$$$$$$$$$$ !!!!!XX!!!!!!!!!!!!!
                   d$$$$$$$$$$$$x!!!!!!#X!!!!!!!!!!!!>
                   3$$$$$$$$$$$$!!!!!!!!$!!!!!!!!!!!!!
                   ?$$$$$$$$$$$!!!!!!!!!$!!!!!!!!!!!!!>
                   ?$$$$$$$$$$?!!!!!!!Xd!!!!!!!!!!!!!!>
                    $$$$$$$$$?!!!!!!!WT!!!!!!!!!!!!!!!!
                    ?$$$$$$$F!!!!!!!td!!!!!!!!!!!!!!!!!
                     $$$$$$$!!!!!!!Ud!!!!!!!!!!!!!!!!!!
                     ?$$$$$$!!!!!!W?!!!!!!!!!!!!!!!!!!!>
                      $$$$$C!!!!!!E!!!!!!!!!!!!!!!!!!!!>
                      ?$$$$$!!!!!!E!!!!!!!!!!!!!!!!!!!!>
                       $$$$$X!!!!!!!!!!!!!!!!!!!!!!!!!!>
                        $$$$b!!!!9!!!!!!!!!!!!!!!!!!!!!>
                        `$$$$$C!!9!!!!!!!!!!!!!!!!!!!!!
                         ?$$$$$$bUi!!!!!!!!!!!!!!!!!!!!
                         `$$$$$$$$$$$$$b!!!!!!!!!!!!!!!
                          ?$$$$$$$$$$$$$f!!!!!!!!!!!!!!
                           $$$$$$$$$$$$$)!!!!!!!!!!!!!>
                            ?$$$$$$$$$$F!!!!!!!!!!!!!!!
                             "$$$$$$$$$!!!!!!!!!!!!!!!!
                               "$$$$$$$!!!!!!!!!!!!!!!!!;
                                ?$$$$$%!!!!!!!!!!!!!!!!!!;
                                 $$$$$!!!!!!!!!!!!!!!!!!!!!
                                 `$$$$P?(`-,      `'(-(-`<>.\'-
                              ,;<(?$$$$-";);         `\\ \.<\.'
                         =<;<<;(<;'?$P"````            `` ` '`

                From: Triteno



                                                
                                                    
                                                    
                                                         
                                                                   
          $$       $$                  $$            $$            
          $$$     $$$                  $$            $$            
          $$$$   $$$$   $$$$$$    $$$$$$$   $$$$$$   $$        $$  
          $$ $$ $$ $$  $$    $$  $$    $$  $$    $$  $$            
          $$  $$$  $$  $$    $$  $$    $$  $$$$$$$$  $$            
          $$   $   $$  $$    $$  $$    $$  $$        $$        $$  
          $$       $$   $$$$$$    $$$$$$$   $$$$$$$  $$            
                                                                   
                                                                                   
                                                                                                     
                                                                    
                                                        
                $$$$$$  $$                              
                  $$    $$                              
                  $$  $$$$$$     $$$$$$   $$$$$$ $$$$   
                  $$    $$      $$    $$  $$   $$   $$  
                  $$    $$      $$$$$$$$  $$   $$   $$  
                  $$    $$  $$  $$        $$   $$   $$  
                $$$$$$   $$$$    $$$$$$$  $$   $$   $$  
                                                                    



                                                    
                                                                          
                                                
***/


/**
 * The Item Model
 * 
 * @class ItemSchema
 * @author francoisrvespa@gmail.com
*/

var config = require('../config.json');

var path = require('path');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var User    = require('./User');

var ItemSchema = new Schema({

  "image": {
    "type": String
  },  

  "references": [
    new Schema({
      "url": String,
      "title": String
    })
  ],

  "subject": {
    "type": String,
    "required": true
  },
  
  "description": {
    "type": String,
    "required": true
  },

  "type": {
    "type": String,
    "required": true,
    "validate": function (type) {
      return ['Topic', 'Problem', 'Solution', 'Agree', 'Disagree', 'Pro', 'Con']
        .indexOf(type) > -1;
    }
  },
  
  "parent": {
    "type": Schema.Types.ObjectId,
    "ref": "Item",
    "index": true
  },

  "from": {
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

ItemSchema.pre('save', function (next, done) {

  var self = this;

  // If creating, set default values

  if ( this.isNew ) {
    this.promotions   = 0;
    this.views        = 0;
    this.created      = Date.now();
  }

  // If image declared (and in case of editing - if image changed)

  if ( this.image && ( this.isNew ? true : ( this.image !== this._original.image ) )  ) {

    next();
    
    var cloudinary = require('cloudinary');
    
    cloudinary.config({ 
      cloud_name      :   config.cloudinary.cloud.name, 
      api_key         :   config.cloudinary.API.key, 
      api_secret      :   config.cloudinary.API.secret 
    });

    return cloudinary.uploader.upload(
      
      path.join(config.tmp, this.image),
      
      function (result) {
        
        console.log('got answer from cloudinary', result.url);

        Item.update({ _id: self._id }, { image: result.url }, done);
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

        if ( parent.image ) {
          this.image = parent.image.replace(/\/upload\//, '/upload/e_grayscale/');
        }

        return next();
      }.bind(this));
  }

  return next();

});

/** Update Item by ID...
 *
 *  @function ItemSchema.updateById
 *  @param {String} id - The Item to update Object Id
 *  @param {Object} item - The patch
 *  @param {updateById~cb} cb - The callback
 *  @return {Object}
 */
ItemSchema.statics.updateById = function (id, item, cb) {
  var self = this;

  self.findById(id, function (error, found) {
    if ( error ) {
      return cb(error);
    }

    for ( var field in item ) {
      found[field] = item[field];
    }

    found.save(cb);
  });
};

/** Evaluate item against 5 others...
 *
 *  @method ItemSchema.evaluate
 *  @param {String} id - The Item to update Object Id
 *  @param {updateById~cb} cb - The callback
 *  @return {Object}
 */

ItemSchema.statics.evaluate = function (id, cb) {
  var self = this;

  this.findById(id, function (error, item) {
    if ( error ) {
      return cb(error);
    }

    if ( ! item ) {
      return cb(new Error('Item not found'));
    }

    switch ( item.type ) {
      case 'Agree':
      case 'Disagree':
      case 'Pro':
      case 'Con':
        var right;

        switch ( item.type ) {
          case 'Agree':
            right = 'Disagree';
            break;
          case 'Disagree':
            right = 'Agree';
            break;
          case 'Pro':
            right = 'Con';
            break;
          case 'Con':
            right = 'Pro';
            break;
        }

        require('async').parallel({
          itemsLeft: function (then) {
            self
              .find({
                type: item.type,
                parent: item.parent
              })

              .where('_id').ne(item._id)

              .limit(2)

              .sort({ views: 1, created: 1 })

              .exec(then);
          },
          itemsRight: function (then) {
            self
              .find({
                type: right,
                parent: item.parent
              })

              .where('_id').ne(item._id)

              .limit(3)

              .sort({ views: 1, created: 1 })

              .exec(then);
          },
          criterias: function (then) {
            require('./Criteria').find({ type: item.type}, then);
          }
        }, function (error, results) {
          cb(error, {
            type: item.type,
            item: id,
            items: results.itemsLeft.concat(results.itemsRight).concat(item),
            criterias: results.criterias
          });
        });
        break;

      default:
        require('async').parallel({
          items: function (then) {
            self
              .find({
                type: item.type,
                parent: item.parent
              })

              .where('_id').ne(item._id)

              .limit(5)

              .sort({ views: 1, created: 1 })

              .exec(then);
          },
          criterias: function (then) {
            require('./Criteria').find({ type: item.type}, then);
          }
        }, function (error, results) {
          cb(error, {
            type: item.type,
            item: id,
            items: results.items.concat(item),
            criterias: results.criterias
          });
        });
        break;
    }

  });
};

/** Fetch item's related data, namely votes and feedbacks ...
 *
 *  @method ItemSchema.details
 *  @param {String} id - The Item to update Object Id
 *  @param {updateById~cb} cb - The callback
 *  @return {Object}
 */

ItemSchema.statics.details = function (id, cb) {
  var self = this;

  require('async').parallel({
      votes: function (then) {
        require('./Vote').getAccumulation(id, then);
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

        /** Get type criterias */

        require('./Criteria')
          .find({ type: item.type }, function (error, criterias) {
            if ( error ) {
              return cb(error);
            }

            /** Return details */

            cb(null, {
              item: item,
              votes: results.votes,
              feedbacks: results.feedbacks,
              criterias: criterias
            });
          });
      });
    });
};

// EXPORT
// ======

var Item = module.exports = mongoose.model('Item', ItemSchema);

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


**/

! function () {
  
  'use strict';

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

  var ItemSchema = new Schema(require('./Item/schema'));

  ItemSchema.plugin(require('mongoose-simple-random'));

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

    var isNew = this.isNew;

    // If creating, set default values

    if ( this.isNew ) {
      this.promotions   =   0;
      this.views        =   0;
      this.created      =   Date.now();
    }

    // keep on going with pre middlewares
    next();

    var asynchronous_hooks = {

      saveImage: function (done) {
        // If image declared (and in case of editing - if image changed)

        var upload_image = false;

        if ( isNew ) {
          upload_image = !! self.image;
        }
        else if ( self._original ) {
          upload_image = !! self.image !== self._original.image;
        }

        if ( upload_image ) {

          // asynchronous - save to cloudinary
          
          var cloudinary = require('cloudinary');
          
          cloudinary.config({ 
            cloud_name      :   config.cloudinary.cloud.name, 
            api_key         :   config.cloudinary.API.key, 
            api_secret      :   config.cloudinary.API.secret 
          });

          cloudinary.uploader.upload(
            
            path.join(config.tmp, self.image),
            
            function (result) {
              Item.update({ _id: self._id }, { image: result.url }, done);
            }      
          );
        }

        // If no image, use parent's image (if any)

        else if ( self.isNew && ! self.image && self.parent ) {
          return Item.findById(self.parent, 'image',
            function (error, parent) {
              if ( error ) {
                return done(error);
              }

              if ( parent.image ) {
                self.image = parent.image.replace(/\/upload\//, '/upload/e_grayscale/');
              }

              return done();
            });
        }

        else {
          done();
        }
      },
      
      fetchUrlTitle: function (done) {
        if ( self.references[0] && self.references[0].url && ! self.references[0].title ) {
          require('../lib/get-url-title')(self.references[0].url,
            function (error, title) {
              if ( error ) {
                return done(error);
              }
              Item.update({ _id: self._id },
                {
                  "references.0.title": title
                },
              done);
            });
        }
        else {
          done();
        }
      }
    };

    require('async').parallel(asynchronous_hooks, done);
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

  ItemSchema.statics.evaluate = require('./Item/evaluate');

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

  // Add view

  ItemSchema.statics.incrementView = function (id, cb) {
    this.findByIdAndUpdate(id, { $inc: { "views": 1 } }, cb);
  };

  // Add promotion

  ItemSchema.statics.incrementPromotion = function (id, cb) {
    this.findByIdAndUpdate(id, { $inc: { "promotions": 1 } }, cb);
  };



  // EXPORT
  // ======

  var Item = module.exports = mongoose.model('Item', ItemSchema);

} ();

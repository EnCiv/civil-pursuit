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

  var config        =     require('../config.json');

  var path          =     require('path');

  var mongoose      =     require('mongoose');

  var Schema        =     mongoose.Schema;

  var User          =     require('./User');

  var ItemSchema    =     new Schema(require('./Item/schema'));

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

  ItemSchema.pre('save', require('./Item/pre.save'));

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

  ItemSchema.statics.incrementView = require('./Item/incrementView');

  // Add promotion

  ItemSchema.statics.incrementPromotion = require('./Item/incrementPromotion');



  // EXPORT
  // ======

  var Item = module.exports = mongoose.model('Item', ItemSchema);

} ();

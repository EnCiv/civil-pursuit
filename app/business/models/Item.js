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

  ItemSchema.post( 'init', function postInit () {
    this._original = this.toObject();
  });

  // PRE VALIDATE
  // ============

  ItemSchema.pre('validate', function preValidate (next) {
  /*  if ( this.isNew && this.parent ) {
      this.parent = Schema.Types.ObjectId(this.parent);
    }*/
    return next();
  });

  // PRE SAVE
  // ========

  ItemSchema.pre('save', require('./Item/pre.save'));

  ItemSchema.statics.evaluate                 =     require('./Item/evaluate');

  ItemSchema.statics.details                  =     require('./Item/details');

  ItemSchema.statics.incrementView            =     require('./Item/incrementView');

  ItemSchema.statics.incrementPromotion       =     require('./Item/incrementPromotion');

  ItemSchema.statics.getBatch                 =     require('./Item/get-batch');

  ItemSchema.methods.getPromotionPercentage   =     require('./Item/get-promotion-percentage');

  ItemSchema.methods.getLineage               =     require('./Item/get-lineage');

  ItemSchema.methods.getEntourage             =     require('./Item/get-entourage');

  ItemSchema.methods.countRelated             =     require('./Item/count-related');

  ItemSchema.methods.getRelated               =     require('./Item/get-related');

  ItemSchema.methods.getHarmony               =     require('./Item/get-harmony');

  // EXPORT
  // ======

  var Item = module.exports = mongoose.model('Item', ItemSchema);

} ();

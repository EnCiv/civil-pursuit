! function () {
  
  'use strict';

  var mongoose    =   require('mongoose');

  var Schema      =   mongoose.Schema;

  var bcrypt      =   require('bcrypt');

  var config      =   require('../config.json');

  var path        =   require('path');

  var UserSchema = new Schema({

    /** email */

    "email": {        
      type:             String,
      required:         true,
      index: {
        unique:         true
      }
    },

    /** password **/
    
    "password": {
      type:             String,
      required:         true
    },

    /** created **/

    "created": {
      type:             Date,
      default:          Date.now
    },

    /** image url **/

    "image":            String,

    /** twitter ID if any **/

    "twitter":          String,

    /** Facebook ID if any **/

    "facebook":         String,

    /** first name **/

     "first_name":      String,

    /** middle name **/

     "middle_name":     String,

    /** last name **/

     "last_name":       String,

    /** gps location **/

    "gps": {
      type:             [Number], // [<longitude>, <latitude>]
      index:            '2d'
    },

    /** Date when GPS was validate **/

    "gps validated":    Date,

    // preferences

    "preferences": [
      new Schema({
        "name":         String,
        "value":        Schema.Types.Mixed
      })
    ],

    /** Activation key */

    "activation_key":   String,

    /** Activation URL */

    "activation_url":   String
  });

  UserSchema.pre('save', require('./User/pre.save'));

  UserSchema.statics.isValidPassword = function (requestPassword, realPassword, cb) {
    bcrypt.compare(requestPassword, realPassword, cb);
  };

  UserSchema.statics.identify = function (email, password, cb) {

    var self = this;

    this.findOne({ email: email }, function (error, user) {
      if ( error ) {
        return cb(error);
      }

      if ( ! user ) {
        return cb(new Error('User not found ' + email));
      }
      
      self.isValidPassword(password, user.password, function (error, isValid) {
        if ( error ) {
          return cb(error);
        }
        
        if ( ! isValid ) {
          return cb(new Error('Wrong password'));
        }
        
        return cb(null, user);
      });
    });
  };

  UserSchema.statics.saveImage = function (id, image, cb) {

    var self = this;

    var cloudinary = require('cloudinary');
          
    cloudinary.config({ 
      cloud_name      :   config.cloudinary.cloud.name, 
      api_key         :   config.cloudinary.API.key, 
      api_secret      :   config.cloudinary.API.secret 
    });

    cloudinary.uploader.upload(path.join(config.tmp, image), function (result) {
      self.update({ _id: id }, { image: result.url }, cb);
    });

    // var imageStream = require('fs').createReadStream(path.join(config.tmp, image), { encoding: 'binary' });

    // imageStream.pipe(stream);
  };

  module.exports = mongoose.model('User', UserSchema);

} ();

! function () {
  
  'use strict';

  var mongoose    =   require('mongoose');

  var Schema      =   mongoose.Schema;

  var bcrypt      =   require('bcrypt');

  var src         =   require(require('path').join(process.cwd(), 'src'));

  var config      =   src('config');

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

    "activation_token":   String
  });

  

  UserSchema.pre('save', require('./User/pre.save'));

  [
    'encrypt-password',
    'identify',
    'reset-password',
    'make-password-resettable'
  ]

    .forEach(function (method) {

      UserSchema.statics[method
        .replace(/-([a-z])/ig, function (m, letter) { return letter.toUpperCase(); })] = src('models/User/' + method);

    });

  /**
    * @method User.statics.isValidPassword
    */

  UserSchema.statics.isValidPassword = function (requestPassword, realPassword, cb) {
    bcrypt.compare(requestPassword, realPassword, cb);
  };

  /**
    * @method User.statics.saveImage
    */

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

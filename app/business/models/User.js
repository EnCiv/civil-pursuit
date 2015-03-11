! function () {
  
  'use strict';

  var mongoose    =   require('mongoose');

  var Schema      =   mongoose.Schema;

  var bcrypt      =   require('bcrypt');

  var src         =   require(require('path').join(process.cwd(), 'src'));

  var config      =   src('config');

  var path        =   require('path');

  var schema      =   require('./User/schema');

  var UserSchema  =   new Schema(schema);

  

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

  UserSchema.statics.addRace            =   require('./User/add-race');
  UserSchema.statics.removeRace         =   require('./User/remove-race');
  UserSchema.statics.setMaritalStatus   =   require('./User/set-marital-status');
  UserSchema.statics.setEmployment      =   require('./User/set-employment');
  UserSchema.statics.setEducation       =   require('./User/set-education');
  UserSchema.statics.setCitizenship     =   require('./User/set-citizenship');
  UserSchema.statics.setBirthdate       =   require('./User/set-birthdate');
  UserSchema.statics.setGender          =   require('./User/set-gender');
  UserSchema.statics.disposable         =   require('./User/disposable');

  module.exports = mongoose.model('User', UserSchema);

} ();

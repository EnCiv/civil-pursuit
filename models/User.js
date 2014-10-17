/**
 * The User Model
 * 
 * @module Models
 * @class UserSchema
 * @author francoisrvespa@gmail.com
*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  "email": {
    "type": String,
    "required": true,
    "index": {
      "unique": true
    }
  },
  "password": {
    "type": String,
    "required": true
  },
  "created": {
    "type": Date,
    "default": Date.now
  }
});

UserSchema.pre('save', function (next) {

  if ( ! this.isNew ) {
    return next();
  }

  this.email = this.email.toLowerCase();

  var self = this;

  var domain = require('domain').create();

  domain.on('error', function (error) {
    next(error);
  });

  domain.run(function () {
    bcrypt.genSalt(10, domain.intercept(function (salt) {
      bcrypt.hash(self.password, salt, domain.intercept(function (hash) {
        self.password  = hash;
        next();
      }));
    }));
  });
});

UserSchema.statics.isValidPassword = function (requestPassword, realPassword, cb) {
  bcrypt.compare(requestPassword, realPassword, function (error, same) {
    return cb(error, same);
    if ( ! same ) {
      return false;
    }
    // -------------------------------------------------------------------------------- \\
    Log.INFO('Email match: %s'         .format(req.body.email));
    // -------------------------------------------------------------------------------- \\
    res.cookie('synuser', { email: req.body.email, id: user._id }, cookie);
    // -------------------------------------------------------------------------------- \\
    Log.OK('User signed in: %s'      .format(req.body.email));
    // -------------------------------------------------------------------------------- \\
    res.json({ in: true });
  });
};

module.exports = mongoose.model('User', UserSchema);

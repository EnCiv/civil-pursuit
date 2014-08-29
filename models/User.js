var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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

  var bcrypt = require('bcrypt');

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

module.exports = mongoose.model('User', UserSchema);

! function () {
  
  'use strict';

  var Model;

  var deps = [
    'path',
    'mongoose',
    'bcrypt',
    'cloudinary',
    'syn/config.json',
    'syn/models/User/schema',
    'syn/models/User/pre/save',
    'syn/lib/util/to-slug',
    'syn/lib/util/to-camel-case'
  ];

  deps = deps.map(function (dep) {
    return require(dep);
  });

  function run (path, mongoose, bcrypt, cloudinary, config, schema, preSave, toSlug, toCamelCase) {
    var UserSchema = new mongoose.Schema(schema);

    UserSchema.pre('save', preSave);

    var statics = [
      'Identify',
      'Reset password',
      'Make password resettable',
      'Is password valid',
      'Save image',
      'Add Race',
      'Remove Race',
      'Set marital status',
      'Set employment',
      'Set education',
      'Set citizenship',
      'Set birthdate',
      'Set gender',
      'Set registered voter',
      'Set party',
      'Disposable'
    ];

    statics.forEach(function (_static) {
      UserSchema.statics[toCamelCase(_static)] =
        require('syn/models/User/statics/' + toSlug(_static));
    });

    var virtuals = [
      'Full name'
    ];

    virtuals.forEach(function (virtual) {

      var _virtual = 'syn/models/User/virtuals/' + toSlug(virtual) + '/get';

      UserSchema
        .virtual(toCamelCase(virtual))
        .get(require(_virtual));
    });

    Model = mongoose.model('User', UserSchema);
  }

  run.apply(null, deps);

  module.exports = Model;

} ();

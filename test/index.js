! function () {
  
  'use strict';

  require('colors');

  var should = require('should');

  var src = require('../src');

  var config = src('config');

  var vars = src('models/test/vars');

  process.env.SYNTEST_EMAIL = vars['test user'].email;

  var Test  = src('lib/Test');

  new Test.suite ('SynApp', {
    
    "Environment":                src('test/env'),
    
    "Mongoose connectivity":      src('models/test/connexion'),
    
    "Socket mockup":              src('io/test/socket-test'),
    
    "Models": {

      /**       =---=---=---=---=-------=---=---=---=       **/
      /**       M   O   D   E   L       U   S   E   R       **/
      /**       =---=---=---=---=-------=---=---=---=       **/
      
      "User": {
        
        "Class":                  src('models/test/User/Class'),
        
        'Create':                 src('models/test/User/Create').bind(
          {
            'email':          vars['test user'].email,
            'password':       vars['test user'].password
          }),

        'Encrypt password':       src('models/test/User/Statics/encrypt-password').bind(
          {
            'password':       vars['test user'].password
          }),
        
        'Identify':               src('models/test/User/Statics/identify').bind(
          {
            'email':          vars['test user'].email,
            'password':       vars['test user'].password
          }),

        'Forget password':        src('models/test/User/Statics/make-password-resettable').bind(
          {
            'email':          vars['test user'].email
          }),

        'Reset Password':               src('models/test/User/Statics/reset-password').bind(
          {
            'email':          vars['test user'].email,
            'password':       vars['test user']['reset password']
          })
      },

      /**       =---=---=---=---=---=       **/
      /**       S   O   C   K   E   T       **/
      /**       =---=---=---=---=---=       **/

      'Socket': {

        // Commented out in order not to send mail during each test

        // 'Forget password':        src('io/test/send-password').bind(
        //   {
        //     'email':          vars['test user'].email
        //   }),

        'Forget password with invalid email':        src('io/test/send-password/no-such-email').bind(
          {
            'email':          '1&&..'
          }),

        'Reset password':             src('io/test/reset-password').bind(
          {
            'email':          vars['test user'].email,
            'password':       vars['test user'].password
          })

      },

      /**     N   I   G   H   T     W   A   T   C   H     **/

      'Night watch': {

        // 'Forgot password':            src('test/nightwatch').bind({
        //   'file':          'app/web/test/forgot-password'
        // }),

        'Reset password':             function (done) {

          src('models/User')

            .findOne({ email: vars['test user'].email })

            .lean()

            .exec(function (error, user) {

              if ( error ) {
                return done (error);
              }

              console.log('user', user);

              process.env.SYNTEST_KEY = user.activation_key;

              process.env.SYNTEST_TOKEN = user.activation_token;

              process.env.SYNTEST_EMAIL = vars['test user'].email;

              process.env.SYNTEST_PASSWORD = vars['test user']['reset password'];

              src('test/nightwatch').apply({
                'file':       'app/web/test/reset-password'
              }, [done]);

            });

        }

      },

      'Cleaning out': {

        'Remove':                     src('models/test/User/Remove').bind(
          {
            'email':          vars['test user'].email
          })

      }
    }

  }, function (error) {
    if ( error ) {
      throw error;
    }

    console.log();

    console.log("\t", 'All your tests are belong to us'.bgGreen);

    console.log();

    process.exit();
  });

} ();

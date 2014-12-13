( function () {

  'use strict';

  module.exports = preRouter;

  function preRouter (req, res, next) {

    /** Making request accessible to response locals */

    res.locals.req = req;

    /** True if user is signed in
     *  @type Boolean
     */

    res.locals.isSignedIn = req.signedCookies.synuser;

    /** If user is signed in */

    if ( res.locals.isSignedIn ) {

      /** Backward compatibility with a previous version
       *  @desc The previous version is identified if there is not an "id" property to the user cookie. User of previous version is then signed off so he can sign in again with a new generation cookie
       */

      if ( ! req.signedCookies.synuser.id ) {
        res.clearCookie('synuser');
        res.locals.isSignedIn = false;
      }

      /** New generation cookie */

      /** Pass user info to response locals */

      else {
        res.locals.email  = req.signedCookies.synuser.email;
        res.locals._id    = req.signedCookies.synuser.id;
      }
    }

    /** Log route request */

    var d = new Date();

    var verbColor = 'cyan';

    if ( req.method === 'POST' || req.method === 'PUT' ) {
      verbColor = 'yellow';
    }

    else if ( req.method === 'DELETE' ) {
      verbColor = 'red';
    }

    console.log(
      ('[' + d.getHours() + ':' + d.getMinutes() +']').grey,
      '>'.blue.bold,
      (res.locals.email ? res.locals.email.yellow : 'anonymous'.grey),
      '---'.grey,
      req.method.bold[verbColor], req.originalUrl);

    /** Function to log response */

    res.locals.logResponse = function () {
      var d = new Date();

      var color = 'green';

      if ( res.statusCode.toString()[0] === '3' ) {
        color = 'cyan';
      }

      else if ( res.statusCode.toString()[0] === '4' ) {
        color = 'yellow';
      }

      else if ( res.statusCode.toString()[0] === '5' ) {
        color = 'red';
      }

      var verbColor = 'cyan';

      if ( req.method === 'POST' || req.method === 'PUT' ) {
        verbColor = 'yellow';
      }

      else if ( req.method === 'DELETE' ) {
        verbColor = 'red';
      }

      console.log(
        ('[' + d.getHours() + ':' + d.getMinutes() +']').grey,
        '<'.green.bold,
        (res.locals.email ? res.locals.email.yellow : 'anonymous'.grey),
        res.statusCode.toString().bold[color],
        req.method.bold[verbColor],
        req.originalUrl);
    };

    /** Function to log message */

    res.locals.logMessage = function (message) {
      var d = new Date();

      console.log(
        ('[' + d.getHours() + ':' + d.getMinutes() +']').grey,
        '*'.magenta.bold,
        (res.locals.email ? res.locals.email.yellow : 'anonymous'.grey),
        message);
    };

    /** Go to next */

    next();
  }

} ) ();

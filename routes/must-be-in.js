/***  Sign in verification middleware
      ===============================

      This route is called for verifying if a user is signed in.

      If the user is signed in, the middleware calls `next()`.

      If the user is **not** signed in, the widdleware calls `next(Unauthorized)`.

***/

module.exports = function (req, res, next) {
  if ( res.locals.isSignedIn ) {
    return next ();
  }
  else {
    return res.redirect('/');
  }
};

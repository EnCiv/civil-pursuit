// ---------------------------------------------------------------------------------------------- \\
var should = require('should');
var path = require('path');;
var base = path.dirname(path.dirname(path.dirname(__dirname)));
// ---------------------------------------------------------------------------------------------- \\
var cookie = require(path.join(base, 'app/business/config.json')).cookie;
// ---------------------------------------------------------------------------------------------- \\
function customError (code, message) {
  var error = new Error(message);
  error.status = code;
  return error;
}
// ---------------------------------------------------------------------------------------------- \\
module.exports = function (req, res, next) {

  (function testArgs () {
      req
        .should.be.an.Object;
  
      req.constructor.name
        .should.equal('IncomingMessage');
  
      req
        .should.have.property('params')
        .which.is.an.Object
        .and.have.property('dir')
          .which.is.a.String;
  
      ['in', 'out', 'up', 'off']        .should.containEql(req.params.dir);
  
      res
        .should.be.an.Object;
      
      res.constructor.name
        .should.equal('ServerResponse');
      
      next
        .should.be.a.Function;
    })();

  var domain = require('domain').create();
  // -------------------------------------------------------------------------------------------- \\
  domain.on('error', function (error) {
    return next(error);
  });
  // -------------------------------------------------------------------------------------------- \\
  domain.run(function () {

    switch ( req.params.dir ) {
 
      case 'up':
        // -------------------------------------------------------------------------------------- \\
        req                             .should.have.property('body');
        // ------------------------------------------------------------------------------------ \\
        req.body                        .should.be.an.Object;
        // ------------------------------------------------------------------------------------ \\
        req.body                        .should.have.property('email');
        // ------------------------------------------------------------------------------------ \\
        req.body.email                  .should.be.a.String;
        // ------------------------------------------------------------------------------------ \\
        req.body                        .should.have.property('password');
        // ------------------------------------------------------------------------------------ \\
        req.body.password               .should.be.a.String;
        // -------------------------------------------------------------------------------------- \\
        
        res.locals.monson.post('/models/User', {
            email: req.body.email,
            password: req.body.password
          },
          domain.intercept(function (created) {
            res.cookie('synuser', { email: req.body.email, id: created._id }, cookie);
            res.json(created);
          }));
        // -------------------------------------------------------------------------------------- \\
        break;
      // ---------------------------------------------------------------------------------------- \\
      /******************************************************************************** SIGN-IN  **/
      // ---------------------------------------------------------------------------------------- \\
      case 'in':

        res.locals.monson.get(
          '/models/User.identify/' + req.body.email + '/' + req.body.password,
            domain.intercept(function onIdentify (user) {
              if ( user ) {
                res.cookie('synuser', { email: user.email, id: user._id }, cookie);
                res.json({ in: true });
              }
        }));
        // -------------------------------------------------------------------------------------- \\
        break;
      // ---------------------------------------------------------------------------------------- \\
      case 'out':

        res.clearCookie('synuser');

        res.redirect('/');
        break;
      // ---------------------------------------------------------------------------------------- \\
    }
    // ------------------------------------------------------------------------------------------ \\
  });
  // -------------------------------------------------------------------------------------------- \\
};
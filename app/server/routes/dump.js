// ---------------------------------------------------------------------------------------------- \\
var should = require('should');
// ---------------------------------------------------------------------------------------------- \\
function customError (code, message) {
  var error = new Error(message);
  error.status = code;
  return error;
}
// ---------------------------------------------------------------------------------------------- \\
module.exports = function (req, res, next) {
    /******************************************************************************** SMOKE-TEST **/
    // ------------------------------------------------------------------------------------------ \\
    req                               .should.be.an.Object;
    // ------------------------------------------------------------------------------------------ \\
    req.constructor.name              .should.equal('IncomingMessage');
    // ------------------------------------------------------------------------------------------ \\
    res                               .should.be.an.Object;
    // ------------------------------------------------------------------------------------------ \\
    res.constructor.name              .should.equal('ServerResponse');
    // ------------------------------------------------------------------------------------------ \\
    next                              .should.be.a.Function;
    // ------------------------------------------------------------------------------------------ \\
  /********************************************************************************   DOMAIN     **/
  // -------------------------------------------------------------------------------------------- \\
  var domain = require('domain').create();
  // -------------------------------------------------------------------------------------------- \\
  domain.on('error', function (error) {
    return next(error);
  });
  // -------------------------------------------------------------------------------------------- \\
  domain.run(function () {
    
    'Backing up Database'         .Info();
    
    require('mongodb').MongoClient.connect(process.env.MONGOHQ_URL,
      domain.intercept(function (db) {
        var collection = db.collection('users');
        collection.find({}).toArray(domain.intercept(function (found) { //return res.json(found);
          var json2csv = require('json2csv');
          json2csv({ data: found, fields: ['_id', 'email', 'password', 'created', '__v'] }, domain.intercept(function (csv) {

            var name = new Date().toISOString().replace(/\s/g, '-');

            var stream = require('fs').createWriteStream(require('path').join(process.cwd(), name + '.csv'));

            stream.write(csv);

            stream.end();

            stream.on('finish', function () {
              res.download(require('path').join(process.cwd(), name + '.csv'), 'synaccord-db-dump.csv',
                domain.intercept(function () {
                  res.redirect('/');
                }));
            });
          }));
        }));
      }));
    // ------------------------------------------------------------------------------------------ \\
  });
  // -------------------------------------------------------------------------------------------- \\
};
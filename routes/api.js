const API_VERSION = '0.0.0';

module.exports = function (req, res, next) {
  var section = req.params.section;

  if ( ! section ) {
    return res.json({
      hello: 'API',
      version: API_VERSION
    });
  }

  require('../lib/api/' + req.params.section)(function (error, response) {
    res.json(response);
  });
};
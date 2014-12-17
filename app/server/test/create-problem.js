(function () {
  
  'use strict';

  var request   =   require('request');
  var mocha     =   require('mocha');
  var assert    =   require('assert');
  var should    =   require('should');
  var path      =   require('path');

  var base      =   path.dirname(path.dirname(path.dirname(__dirname)));

  require(path.join(base, 'app/business/assertions/Response'));

  var test_config = require('./test.json');

  var user, topic;

  describe('Creating new problem', function () {
    var url = 'http://localhost:' + process.env.PORT + '/models/Item',
      error,
      response,
      body;

    before( function (done) {
      var monson = require('monson')(process.env.MONSON_MONGODB,
        { base: path.join(__dirname, '../../business') });

      monson.get('models/User?email=' + test_config['test user'].email,
        function (error, users) {
          if ( error ) {
            return done(error);
          }
          
          if ( ! users.length ) {
            throw new Error('Could not find test user');
          }

          user = users[0];

          monson.get('models/Item?type=Topic&subject=' +
            test_config['test topic'].subject, function (error, items) {
              if ( error ) {
                throw error;
              }

              if ( ! items.length ) {
                throw new Error('Could not find test topic');
              }

              topic = items[0];

              request.post(
                {
                  url: url,
                  json: true,
                  body: {
                    type: 'Problem',
                    parent: topic._id,
                    subject: test_config['test problem'].subject,
                    description: 'generatedTESTMOCHA DES DES',
                    user: user._id
                  },
                  jar: true
                },
                function ($error, $response, $body) {
                  error = $error;
                  response = $response;
                  body = $body;
                  done($error);
                });
            });
          
        });
    });

    it('should not have errors', function () {
      should(error).not.be.an.Error;
    });

    it('should have a response', function () {
      should(response).be.a.Response;
    });

    it('should have status 200', function () {
      response.statusCode.should.equal(200);
    });

    it('should be a JSON', function () {
      should(body).be.an.Object;
    });
  });  

})();

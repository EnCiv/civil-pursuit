(function () {

  'use strict';

  var request   =   require('request');
  var mocha     =   require('mocha');
  var assert    =   require('assert');
  var should    =   require('should');
  var path      =   require('path');

  var User, Topic, Problem,
    Email = Date.now () + '@synapp.com';

  var base      =   path.dirname(path.dirname(path.dirname(__dirname)));

  require(path.join(base, 'app/business/assertions/Response'));

  var monson = require('monson')(process.env.MONSON_MONGODB,
    { base: path.join(__dirname, '../../business') });

  describe('Cleaning out', function () {

    var test_config = require('./test.json');

    var topic, problem;

    before(function (done) {

      monson.get('models/Item?type=Topic&subject=' +
        test_config['test topic'].subject, function (error, items) {
          if ( error ) {
            throw error;
          }

          if ( ! items.length ) {
            throw new Error('Could not find test topic');
          }

          topic = items[0];

          monson.get('models/Item?type=Problem&subject=' +
            test_config['test problem'].subject, function (error, items) {
              if ( error ) {
                throw error;
              }

              if ( ! items.length ) {
                throw new Error('Could not find test problem');
              }

              problem = items[0];

              done();
            });

        });
    });

    it('should remove created test user', function (done) {
      monson.del('models/User?email=' +
          test_config['test user'].email,
        done);
    });

    it('should remove created test topic', function (done) {
      monson.del('models/Item?_id=' + topic._id,
        done);
    });

    it('should remove created test problem', function (done) {
      monson.del('models/Item?_id=' + problem._id,
        done);
    });
  });

})();

! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'request',
    'string',
    'syn/lib/Test',
    'syn/models/Item',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  function test__models__Item__methods__getUrlTitle (done) {

    di(done, deps, function (domain, httpGet, S, Test, Item, mongoUp) {

      try {
        should.Assertion.add('Item', require('../.Item'), true);
      }
      catch ( error ) {
        // Assertion item already loaded
      }

      var mongo = mongoUp();

      var url = 'http://www.example.com';

      var item;

      var title;

      function test__models__Item__methods__getUrlTitle____getUrlTitleUsingRequest (done) {
        httpGet(url, domain.intercept(function (response, body) {
          
          response.should.be.an.Object;
          response.should.have.property('statusCode')
            .which.is.a.Number
            .and.is.exactly(200);

          body.should.be.a.String;

          body

            .replace(/\r/g, '')

            .replace(/\n/g, '')

            .replace(/\t/g, '')

            .replace(/<title>(.+)<\/title>/, function (matched, _title) {

              title = S(_title).decodeHTMLEntities().s;

            });

          done()

        }));
      }

      function test__models__Item__methods__getUrlTitle____is_A_Function (done) {

        Item.schema.methods.should.have.property('getUrlTitle')
            .which.is.a.Function;
          done();
      }

      function test__models__Item__methods__getUrlTitle____getRandomItem (done) {

        Item.findOneRandom(domain.intercept(function (randomItem) {
          item = randomItem;
          done(); 
        }))
      }

      function test__models__Item__methods__getUrlTitle____isAnItem (done) {

        item.should.be.an.Item;
        done();

      }

      function test__models__Item__methods__getUrlTitle____getUrlTitleShouldMatch (done) {

        item.getUrlTitle(domain.intercept(function (_title) {
          _title.should.be.a.String;
          _title.should.be.exactly(title);
          done();
        }));
        
      }

      function test__models__Item__methods__getUrlTitle____cleaningOut (done) {

        mongo.disconnect(done);
      }

      Test([

          test__models__Item__methods__getUrlTitle____is_A_Function,
          test__models__Item__methods__getUrlTitle____getUrlTitleUsingRequest,
          test__models__Item__methods__getUrlTitle____getRandomItem,
          test__models__Item__methods__getUrlTitle____isAnItem,
          test__models__Item__methods__getUrlTitle____getUrlTitleShouldMatch,
          test__models__Item__methods__getUrlTitle____cleaningOut

        ], done);

    });

  }

  module.exports = test__models__Item__methods__getUrlTitle;

} ();

! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'request',
    'string',
    'syn/lib/Test',
    'syn/models/Item',
    'syn/models/User',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  function test__models__Item__methods__getUrlTitle (done) {

    di(done, deps, function (domain, httpGet, S, Test, Item, User, mongoUp) {

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

      function test__models__Item__methods__getUrlTitle____createItem (done) {

        Item.disposable(domain.intercept(function (testItem) {
          item = testItem;
          item.references.push({ url: url });
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

        User.remove({ _id: item.user }, domain.intercept(function () {
          item.remove(domain.intercept(function () {
            mongo.disconnect(done);
          }));
        }));
        
      }

      Test([

          test__models__Item__methods__getUrlTitle____is_A_Function,
          test__models__Item__methods__getUrlTitle____getUrlTitleUsingRequest,
          test__models__Item__methods__getUrlTitle____createItem,
          test__models__Item__methods__getUrlTitle____isAnItem,
          test__models__Item__methods__getUrlTitle____getUrlTitleShouldMatch,
          test__models__Item__methods__getUrlTitle____cleaningOut

        ], done);

    });

  }

  module.exports = test__models__Item__methods__getUrlTitle;

} ();

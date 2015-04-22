! function () {
  
  'use strict';

  var should = require('should');

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'request',
    'string',
    'syn/lib/Test',
    'syn/lib/get-url-title',
    'should'
  ];

  module.exports = function test__lib__getUrlTitle (done) {

    var url = 'http://www.example.com';
    var title;

    di(done, deps, function (domain, httpGet, S, Test, getUrlTitle) {

      function test__lib__getUrlTitle____is_A_Function (done) {
        getUrlTitle.should.be.a.Function;
        done();
      }

      function test__lib__getUrlTitle____getUrlTitle (done) {
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

      function test__lib__getUrlTitle____shouldMatch (done) {
        getUrlTitle(url, domain.intercept(function (_title) {
          _title.should.be.exactly(title);
          done();
        }));
      }

      Test([

          test__lib__getUrlTitle____is_A_Function,
          test__lib__getUrlTitle____getUrlTitle,
          test__lib__getUrlTitle____shouldMatch

        ], done);

    });
    
  };

} ();

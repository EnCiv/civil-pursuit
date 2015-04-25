! function () {
  
  'use strict';

  var should = require('should');

  var httpGet = require('request');

  var S = require('string');

  var url = 'http://www.example.com';
  
  var title;

  var getUrlTitle;

  describe ( 'Lib / Util / Get URL Title' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function () {

      getUrlTitle = require('syn/lib/util/get-url-title');

    } );

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a function' , function () {

      getUrlTitle.should.be.a.Function;

    } );

    ///////////////////////////////////////////////////////////////////////////

    describe ( 'Get URL Title' , function () {

      /////////////////////////////////////////////////////////////////////////

      before ( function (done) {

        this.timeout(20000);

        httpGet(url, function (error, response, body) {

          if ( error ) return done(error);

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

          done();
        });

      } );

      /////////////////////////////////////////////////////////////////////////

      describe ( 'should be the right title' , function () {

        it ( 'As a promise' , function (done) {

          this.timeout(20000);

          getUrlTitle(url).then(function (_title) {

            _title.should.be.exactly(title);
            
            done();

          });

        });

        it ( 'As a callback' , function (done) {

          this.timeout(20000);

          getUrlTitle(url, function (error, _title) {

            if ( error ) return done(error);

            _title.should.be.exactly(title);
            
            done();

          });

        });
      
      } );

    } );

    ///////////////////////////////////////////////////////////////////////////

  } );

} ();

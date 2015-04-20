! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'syn/models/Vote',
    'syn/lib/util/connect-to-mongoose',
    'should'
  ];

  module.exports = function Test__models__Vote (done) {

    di(done, deps, function (domain, Test, Vote, mongoUp) {

      var mongo = mongoUp();

      var vote, accumulation;

      function models__Vote__statics__getAccumulation____Exists (done) {
        Vote.schema.statics.should.have.property('getAccumulation');
        done();
      }

      function models__Vote__statics__getAccumulation____Is_A_Function (done) {
        Vote.schema.statics.getAccumulation.should.be.a.Function;
        done();
      }

      function models__Vote__statics__getAccumulation____findRandomVote (done) {
        
        Vote.findOneRandom(domain.intercept(function (randomVote) {
          randomVote.should.be.an.Object;
          randomVote.should.have.property('_id');
          vote = randomVote;
          done();
        }));

      }

      function models__Vote__statics__getAccumulation____getAccumulation (done) {

        Vote.getAccumulation(vote.item, domain.intercept(function (cumul) {
          accumulation = cumul;
          done();
        }));

      }

      function models__Vote__statics__getAccumulation____isAnObject (done) {
        accumulation.should.be.an.Object;
        done();
      }

      function models__Vote__statics__getAccumulation____eachCriteriaIsAnObject (done) {
        
        for ( var criteria in accumulation ) {
          accumulation[criteria].should.be.an.Object;
        }

        done();
      }

      function models__Vote__statics__getAccumulation____eachCriteriaHasTotal (done) {
        
        for ( var criteria in accumulation ) {
          accumulation[criteria].should.have.property('total');
        }

        done();
      }

      function models__Vote__statics__getAccumulation____eachTotalIs_A_Number (done) {
        
        for ( var criteria in accumulation ) {
          accumulation[criteria].total.should.be.a.Number;
        }

        done();
      }

      function models__Vote__statics__getAccumulation____eachTotalIsTheSumOfValues (done) {
        
        for ( var criteria in accumulation ) {
          var total = accumulation[criteria].values['-1'] +
            accumulation[criteria].values['+0'] +
            accumulation[criteria].values['+1'];

          accumulation[criteria].total.should.be.exactly(total);
        }

        done();
      }

      function models__Vote__statics__getAccumulation____valuesAreNumbers (done) {
        
        for ( var criteria in accumulation ) {
          accumulation[criteria].values['-1'].should.be.a.Number;
          accumulation[criteria].values['+0'].should.be.a.Number;
          accumulation[criteria].values['+1'].should.be.a.Number;
        }

        done();
      }

      function disconnect (cb) {
        mongo.disconnect(cb);
      }

      Test([

          models__Vote__statics__getAccumulation____Exists,
          models__Vote__statics__getAccumulation____Is_A_Function,
          models__Vote__statics__getAccumulation____findRandomVote,
          models__Vote__statics__getAccumulation____getAccumulation,
          models__Vote__statics__getAccumulation____isAnObject,
          models__Vote__statics__getAccumulation____eachCriteriaIsAnObject,
          models__Vote__statics__getAccumulation____eachCriteriaHasTotal,
          models__Vote__statics__getAccumulation____eachTotalIs_A_Number,
          models__Vote__statics__getAccumulation____eachTotalIsTheSumOfValues,
          models__Vote__statics__getAccumulation____valuesAreNumbers,
          disconnect

        ], done);

    });
    
  };

} ();

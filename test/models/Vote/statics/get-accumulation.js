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
          console.log(accumulation)
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

      Test([

          models__Vote__statics__getAccumulation____Exists,
          models__Vote__statics__getAccumulation____Is_A_Function,
          models__Vote__statics__getAccumulation____findRandomVote,
          models__Vote__statics__getAccumulation____getAccumulation,
          models__Vote__statics__getAccumulation____isAnObject,
          models__Vote__statics__getAccumulation____eachCriteriaIsAnObject

        ], done);

    });
    
  };

} ();

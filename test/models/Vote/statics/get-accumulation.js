! function () {
  
  'use strict';

  var async         =   require('async');
  var Item          =   require('syn/models/Item');
  var User          =   require('syn/models/User');
  var Vote          =   require('syn/models/Vote');
  var Criteria      =   require('syn/models/Criteria');
  var mongoUp       =   require('syn/lib/util/connect-to-mongoose');
  var isA           =   require('syn/lib/util/should/add');
  var fulfill       =   require('syn/lib/util/di/domain');

  var mongo, item, accumulation, user, criteria;

  function getUser () {
    User
      .disposable()
      .then(getItem);
  }

  function getItem (user) {
    Item
      .disposable({ user: user._id })
      .then(done.bind(null, user));
  }

  function getCriteria (user, item) {
    Criteria
      .find({ type: item.type })
      .exec()
      .then(function (criterias) {

      });
  }

  function vote (user, item, criteria) {
    Vote
      .create({
        item        :   item._id,
        user        :   user._id,
        criteria    :   criteria._id,
        value       :   '+1'
      })
  }

  describe ( 'Models / Votes / Statics / Get Accumulation' , function () {

    ///////////////////////////////////////////////////////////////////////////

    before ( function (done) {

      this.timeout(5000);

      isA ( 'Vote' ,          require('../.Vote') );

      isA ( 'Accumulation' ,  require('../.Accumulation') );

      mongo = mongoUp();

      User
        .disposable()
        .then(function (_user) {
          user = _user;

          Item
            .disposable({ user: user._id })
            .then(function (_item) {

              item = _item;

              Criteria
                .findOneRandom()
                .then(function (_criteria) {

                  criteria = _criteria;

                  Vote
                    .

                }, done);

            }, done)

        }, done);

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be a function' , function () {

      Vote.schema.statics.getAccumulation.should.be.a.Function;

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be not throw error' , function (done) {

      Vote.getAccumulation(item._id, function (error, _accumulation) {
        
        if ( error ) {
          return done(error);
        }

        console.log('accumulation', _accumulation)

        accumulation = _accumulation;

        done();

      });

    });

    ///////////////////////////////////////////////////////////////////////////

    it ( 'should be an accumulation' , function () {

      accumulation.should.be.an.Accumulation;

    });

    ///////////////////////////////////////////////////////////////////////////

    after ( function (done) {

      mongo.disconnect(done);

    } );

  } );

  module.exports = function Test__models__Vote (done) {

    di(done, deps, function (domain, Test, Vote, mongoUp) {

      var mongo = mongoUp();

      var vote, accumulation;

      function Exists (done) {
        Vote.schema.statics.should.have.property('getAccumulation');
        done();
      }

      function Is_A_Function (done) {
        Vote.schema.statics.getAccumulation.should.be.a.Function;
        done();
      }

      function findRandomVote (done) {
        
        Vote.findOneRandom(domain.intercept(function (randomVote) {
          randomVote.should.be.an.Object;
          randomVote.should.have.property('_id');
          vote = randomVote;
          done();
        }));

      }

      function getAccumulation (done) {

        Vote.getAccumulation(vote.item, domain.intercept(function (cumul) {
          accumulation = cumul;
          done();
        }));

      }

      function isAnObject (done) {
        accumulation.should.be.an.Object;
        done();
      }

      function eachCriteriaIsAnObject (done) {
        
        for ( var criteria in accumulation ) {
          accumulation[criteria].should.be.an.Object;
        }

        done();
      }

      function eachCriteriaHasTotal (done) {
        
        for ( var criteria in accumulation ) {
          accumulation[criteria].should.have.property('total');
        }

        done();
      }

      function eachTotalIs_A_Number (done) {
        
        for ( var criteria in accumulation ) {
          accumulation[criteria].total.should.be.a.Number;
        }

        done();
      }

      function eachTotalIsTheSumOfValues (done) {
        
        for ( var criteria in accumulation ) {
          var total = accumulation[criteria].values['-1'] +
            accumulation[criteria].values['+0'] +
            accumulation[criteria].values['+1'];

          accumulation[criteria].total.should.be.exactly(total);
        }

        done();
      }

      function valuesAreNumbers (done) {
        
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

          Exists,
          Is_A_Function,
          findRandomVote,
          getAccumulation,
          isAnObject,
          eachCriteriaIsAnObject,
          eachCriteriaHasTotal,
          eachTotalIs_A_Number,
          eachTotalIsTheSumOfValues,
          valuesAreNumbers,
          disconnect

        ], done);

    });
    
  };

} ();

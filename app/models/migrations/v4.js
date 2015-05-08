! function () {
  
  'use strict';

  var MongoClient =   require('mongodb').MongoClient;

  var mongoose    =   require('mongoose');

  var async       =   require('async');

  var Criteria    =   require('syn/models/Criteria');

  var Type        =   require('syn/models/Type');

  var updated     =   0;

  var domain      =   require('domain').create();
    
  domain.on('error', function (error) {
    throw error;
  });
  
  domain.run(function () {

    mongoose.connect(process.env.MONGOHQ_URL);

    function findTypes (cb) {
      Type
        .find()
        .limit(9999)
        .exec(cb);
    }

    function findCriterias (cb) {
      MongoClient.connect(process.env.MONGOHQ_URL, function (error, db) {
        if ( error ) return cb(error);

        db.collection('criterias')
          .find({ type: { $type: 2 } })
          .toArray(cb);
      });
    }

    function updateCriterias (criterias, types, cb) {

      updated = criterias.length;
      
      if ( ! updated ) {
        return done();
      }

      criterias.forEach(function updateCriteria (criteria) {
        types.forEach(function (type) {
          if ( type.name === criteria.type ) {
            criteria.type = type;
          }
        });
      });

      async.each(criterias, function (criteria, cb) {
        Criteria
          .update({ _id: criteria._id }, { type: criteria.type })
          .exec(cb);
      }, cb);
    }

    function done (error) {
      if ( error ) {
        throw error;
      }
      console.log('Migration to v4; OK!', 'Updated:', updated);
      process.exit(0);
    }

    findTypes(domain.intercept(function (types) {
      findCriterias(domain.intercept(function (criterias) {
        updateCriterias(criterias, types, done);
      }));
    }));

  });  

} ();

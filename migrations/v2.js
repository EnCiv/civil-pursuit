! function () {
  
  'use strict';

  var mongoose = require('mongoose');

  var async = require('async');

  var Type = require('syn/models/Type');
  var Item = require('syn/models/Item');

  mongoose.connect(process.env.MONGOHQ_URL);

  var MongoClient = require('mongodb').MongoClient;

  // Connection URL
  var url = process.env.MONGOHQ_URL;

  var _Types = [

    { name: 'Intro' },
    { name: 'Topic' },
    { name: 'Problem',  parent: 'Topic',    harmony: ['Agree', 'Disagree'] },
    { name: 'Solution', parent: 'Problem',  harmony: ['Pro', 'Con'] },
    { name: 'Pro',      parent: 'Solution' },
    { name: 'Con',      parent: 'Solution' },
    { name: 'Agree',    parent: 'Problem' },
    { name: 'Disagree', parent: 'Problem' },

  ];

  async.each(_Types, function forEachType (_type, done) {
    Type.findOne({ name: _type.name }, function (error, type) {
      if ( error ) return done(error);

      var parallels = [];

      if ( _type.parent ) {
        parallels.push(Type.findOne.bind(Type, { name: _type.parent }));
      }

      if ( _type.harmony && _type.harmony.length ) {
        parallels.push(Type.findOne.bind(Type, { name: _type.harmony[0] }),
          Type.findOne.bind(Type, { name: _type.harmony[1] }));
      }

      if ( ! type ) {
        async.parallel(parallels, function (error) {
          if ( error ) return done(error);
          forEachType(_type, done);
        });

        return;
      }

      async.parallel(parallels, function (error, results) {
        if ( error ) return done(error);

        if ( _type.parent ) {
          var parent = results[0];

          if ( ! type.parent || parent._id.toString() !== type.parent.toString() ) {
            type.parent = parent._id;
          }
        }

        type.save(updateItemTypes.bind(null, function () {
          console.log('Migration v2 OK');
          process.exit(0);
        }));

      });
    });
  });

  function updateItemTypes (cb) {

    Type.find(function (error, typesAsArray) {

      var types = {};

      typesAsArray.forEach(function (type) {
        types[type.name] = type._id;
      });

      MongoClient.connect(url, function(err, db) {

        if ( err ) throw err;

        var mapped = [];

        db.collection('items')
          .find({ type: { $type: 2 } })
          .toArray(function (error, items) {
            
            mapped = mapped.concat(items.map(function (item) {
              item.type = types[item.type];

              return item;
            }));

            async.each(mapped, function (item, cb) {
              db.collection('items').update({ _id: item._id },
              {
                $set: {
                  type: item.type
                }
              }, cb);
            }, cb);

          });

      });

    });
  }

  // async.series([ seeIfWeAlreadyMigrated ],

  //   function (error, results) {
  //     if ( error ) throw error;

  //     updateItemTypes(function (error, results) {
  //       if ( error ) throw error;

  //       console.log('Migratin OK');
  //       process.exit(0);
  //     });
  //   });

} ();

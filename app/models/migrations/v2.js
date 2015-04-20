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

  function findTypes (cb) {
    Type.find(function (error, types) {
      if ( error ) throw error;

      if ( types.length ) {
        return cb();
      }

      insertTypes(cb);
    });
  }

  function insertTypes (cb) {
    async.parallel({
      Topic:      function (cb) { Type.create({ name: 'Topic' }, cb); },
      Problem:    function (cb) { Type.create({ name: 'Problem' }, cb); },
      Agree:      function (cb) { Type.create({ name: 'Agree' }, cb); },
      Disagree:   function (cb) { Type.create({ name: 'Disagree' }, cb); },
      Solution:   function (cb) { Type.create({ name: 'Solution' }, cb); },
      Pro:        function (cb) { Type.create({ name: 'Pro' }, cb); },
      Con:        function (cb) { Type.create({ name: 'Con' }, cb); },
    }, function (error, types) {
      if ( error ) throw error;

      console.log('types', types)

      async.parallel({
        Problem: function (cb) {
          Type.update({ name: 'Problem' }, {
            $set: {
              parent: types.Topic._id
            },
            $push: {
              harmony: {
                $each: [
                  {
                    name: types.Agree._id
                  },
                  {
                    name: types.Disagree._id
                  }
                ]
              }
            }
          }, {
            upsert  : true,
            safe    : true
          }, cb);
        },

        Solution: function (cb) {
          Type.update({ name: 'Solution' }, {
            $set: {
              parent: types.Problem._id
            },
            $push: {
              harmony: {
                $each: [
                  {
                    name: types.Pro._id
                  },
                  {
                    name: types.Con._id
                  }
                ]
              }
            }
          }, {
            upsert  : true,
            safe    : true
          }, cb);
        },

        Agree: function (cb) {
          Type.update({ name: 'Agree' }, {
            $set: {
              parent: types.Problem._id
            }
          }, {
            upsert  : true,
            safe    : true
          }, cb);
        },

        Disagree: function (cb) {
          Type.update({ name: 'Disagree' }, {
            $set: {
              parent: types.Problem._id
            }
          }, {
            upsert  : true,
            safe    : true
          }, cb);
        },

        Pro: function (cb) {
          Type.update({ name: 'Pro' }, {
            $set: {
              parent: types.Solution._id
            }
          }, {
            upsert  : true,
            safe    : true
          }, cb);
        },

        Con: function (cb) {
          Type.update({ name: 'Con' }, {
            $set: {
              parent: types.Solution._id
            }
          }, {
            upsert  : true,
            safe    : true
          }, cb);
        }

      }, cb);
    });
  }

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

  async.series([ findTypes ],

    function (error, results) {
      if ( error ) throw error;

      updateItemTypes(function (error, results) {
        if ( error ) throw error;

        console.log('Migratin OK');
        process.exit(0);
      });
    });

} ();

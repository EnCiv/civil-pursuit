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
    { name: 'Problem', parent: 'Topic', harmony: ['Agree', 'Disagree'] },
    { name: 'Solution', parent: 'Problem', harmony: ['Pro', 'Con'] },
    { name: 'Pro', parent: 'Solution' },
    { name: 'Con', parent: 'Solution' },
    { name: 'Agree', parent: 'Problem' },
    { name: 'Disagree', parent: 'Problem' },

  ];

  function findTypes (cb) {
    Type.find(function (error, types) {
      if ( error ) throw error;

      _Types = _Types.map(function (_type) {

        _type.exists = types.some(function (type) {
          return _type.name === type.name;
        });

        return _type;

      });

      if ( _Types.every(function (_type) { return _type.exists; } ) ) {
        return cb();
      }

      insertTypes(cb);
    });
  }

  function insertTypes (cb) {
    async.parallel(
      
      _Types

        .filter(function (_type) {
          return ! _type.exists;
        })

        .reduce(function (parallels, type) {
      
          parallels[type] = function (cb) {
            Type.create({ name: type.name }, cb);
          };
          
          return parallels;
        }, {}),

      function (error, types) {
        if ( error ) return cb(error);

        console.log('types', types);

        async.parallel(
          _Types
            
            .filter(function (type) {
              return type.parent;
            })

            .map(function (type) {
              return function (cb) {

                console.log()
                console.log()
                console.log()
                console.log({
                  name: this.name,
                  parent: this.parent,
                  parentId: types[this.parent]
                })
                console.log()
                console.log()
                console.log()

                Type.update({ name: this.name },
                  { $set: { parent: types[this.parent]._id } },
                  cb);
              }.bind(type);
            })

            .concat(
              _Types
            
                .filter(function (type) {
                  return type.harmony;
                })

                .map(function (type) {
                  return function (cb) {
                    Type.update({ name: type.name },
                      {
                        $push: {
                          harmony: _Types
                            
                            .filter(function (_type) {
                              return type.harmony.indexOf(_type.name) > -1;
                            })

                            .map(function (_type) {
                              return { name: types[_type.name]._id };
                            })
                        }
                      },
                      cb);
                  };
                })
            ),

          cb);
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

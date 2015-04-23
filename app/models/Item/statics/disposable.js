! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'async',
    'syn/models/Type',
    'syn/models/User',
    'syn/models/Item'
  ];

  function disposable (cb) {
    
    di(cb, deps, function (domain, async, Type, User, Item) {

      function createItem (results) {

        if ( results.type.parent && ! results.parent ) {
          return Item
            .findOneRandom({ type: results.type.parent._id },
              domain.intercept(function (item) {
                results.parent = item;
                createItem(results);  
              }))
        }

        var newItem = {
          subject       :   'Disposable Item ' + new Date(),
          description   :   'Disposable Item',
          user          :   results.user._id,
          type          :   results.type._id
        };

        if ( results.parent ) {
          newItem.parent = results.parent._id;
        }

        Item

          .create(newItem, cb);

      }

      async.parallel({
          
          type    :   Type.findOneRandom.bind(Type),
          user    :   User.disposable.bind(User)

        },

        domain.intercept(createItem));

    });

  }

  module.exports = disposable;

} ();

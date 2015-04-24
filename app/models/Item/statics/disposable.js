! function () {
  
  'use strict';
  'have fun!';

  var di = require('syn/lib/util/di/domain');

  var async   =   require('async');
  var Promise =   require('promise');
  var Type    =   require('syn/models/Type');
  var User    =   require('syn/models/User');

  require('syn/lib/util/promisify');

  function disposable (cb) {

    var Item = this;

    var q = new Promise(function (fulfill, reject) {

      Function
        
        .promisify(async.parallel, async)
        
        .when({
          type    :   Type.findOneRandom.bind(Type),
          user    :   User.disposable.bind(User)
        })

        .then(function createItem (results) {

          if ( results.type.parent && ! results.parent ) {
            
            // FIND PARENT

            Function
              
              .promisify(Item.findOneRandom, Item)
              
              .when({ type: results.type.parent })
              
              .then(function (item) {
                results.parent = item;
                createItem(results);
              })

              .catch(reject);

            return;
          }

          // CREATE ITEM

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

            .create(newItem)
            .then(fulfill, reject);
        })

        .catch(reject);

    });

    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;

  }

  module.exports = disposable;

} ();

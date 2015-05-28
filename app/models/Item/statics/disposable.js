'use strict';

import Type from 'syn/models/Type';
import User from 'syn/models/User';
import {Domain} from 'domain';

function findType (options) {
  options = options || {};

  return new Promise((fulfill, reject) => {
    let d = new Domain().on('error', reject);

    d.run(() => {
      process.nextTick(() => {
        console.log('findType', options)
        if ( options.type ) {
          // Object ID
          if ( typeof options.type === 'object' ) {
            Type
              .findById(options.type)
              .exec()
              .then(fulfill, reject);
          }
        }
        // Find any type
        else {
          Type
            .findOneRandom(d.intercept(fulfill));
        }
      });
    });
  });
}

function createItem (type, user, parent) {
  let Item = this;
  
  return new Promise((fulfill, reject) => {
    let d = new Domain().on('error', reject);

    d.run(() => {
      process.nextTick(() => {
        console.log('createItem', type, user, parent)
        // If type has a parent, then create a parent

        if ( type.parent && ! parent ) {
          console.log('fetch item parent')
          // Create parent
          
          disposableItem.apply(Item, [{ type: type.parent }])

            .then(function (item) {

              // attach parent to results

              parent = item;

              // Then call create item agains
              
              createItem(null, results);
            }, reject);

          // Stop here since we are calling back the function above

          return;
        }

        // CREATE ITEM

        var newItem     =   {
          subject       :   'Disposable Item Of Type ' + type.name +
            ' Created on ' + new Date(),
          description   :   'Disposable Item',
          user          :   user._id,
          type          :   type._id
        };

        if ( parent ) {
          newItem.parent = parent._id;
        }

        // Create item in DB and done

        Item.create(newItem, d.intercept(function (item) {
          fulfill(item)
        }));
      });
    });
});
}

function disposableItem (options) {
  options = options || {};

  return new Promise((fulfill, reject) => {
    let d = new Domain().on('error', reject);

    d.run(() => {
      process.nextTick(() => {
        console.log('disposableItem', options)
        // We need a type and a user for the item
        Promise.all([
          findType(options),
          User.disposable()
        ])
          .then(null, reject)
          .then(results => {

            let type = results[0];
            let user = results[1];

            createItem.apply(this, [type, user]).then(fulfill, reject);
          });
      });
    });
  });
}

export default disposableItem;

// ! function () {

// 'use strict';

// var Domain      =   require('domain').Domain;
// var async       =   require('async');
// var Promise     =   require('promise');
// var Type        =   require('syn/models/Type');
// var User        =   require('syn/models/User');

// /**   Create disposable item
//  *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  *    @function
//  *    @arg            {Object?} options
//  *    @arg            {Function} cb
//  *    @signature      (options, cb), (cb)
// */

// function disposableItem (options, cb) {

//   if ( typeof options === 'function' && ! ( '1' in arguments ) ) {
//     cb = options;
//     options = {};
//   }

//   options = options || {};

//   var Item = this;

//   // Returning a promise

//   var q = new Promise(function (fulfill, reject) {

//     // Create domain

//     var d = new Domain().on('error', reject);

//     /**   Function to find item's type
//      *    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//      *    @function
//      *    @arg          {Function} done
//     */

//     function findType (done) {

//       if ( options.type ) {

//         // Object ID
//         if ( typeof options.type === 'object' ) {
//           Type
//             .findById(options.type)
//             .exec(done);
//         }
//       }
//       // Find any type
//       else {
//         Type
//           .findOneRandom(done);
//       }
//     }

//     // We need a type and a user for the item

//     async.parallel({
//       type    :   findType,
//       user    :   User.disposable.bind(User)
//     }, createItem);

//     /**
//      *    @arg          {Error?} error
//      *    @arg          {Object} results
//      *    @return       null
//     */

//     function createItem (error, results) {

//       // If type has a parent, then create a parent

//       if ( results.type.parent && ! results.parent ) {

//         // Create parent
        
//         disposableItem.apply(Item, [{ type: results.type.parent }])

//           .then(function (item) {

//             // attach parent to results

//             results.parent = item;

//             // Then call create item agains
            
//             createItem(null, results);
//           });

//         // Stop here since we are calling back the function above

//         return;
//       }

//       // CREATE ITEM

//       var newItem     =   {
//         subject       :   'Disposable Item Of Type ' + results.type.name +
//           ' Created on ' + new Date(),
//         description   :   'Disposable Item',
//         user          :   results.user._id,
//         type          :   results.type._id
//       };

//       if ( results.parent ) {
//         newItem.parent = results.parent._id;
//       }

//       // Create item in DB and done

//       Item.create(newItem, d.intercept(function (item) {
//         fulfill(item)
//       }));
//     }

//   });

//   if ( typeof cb === 'function' ) {
//     q.then(cb.bind(null, null), cb);
//   }

//   return q;

// }

// module.exports = disposableItem;

// } ();

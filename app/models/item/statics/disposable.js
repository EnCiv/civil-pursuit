'use strict';

import TypeModel        from 'syn/models/type';
import UserModel        from 'syn/models/user';
import { Domain }       from 'domain';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class DisposableItem {

  static dispose (options) {
    options = options || {};
    console.log('disposable item', options)
    
    return new Promise((ok, ko) => {
      Promise
        .all([
          DisposableItem.findType(options),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable(),
          UserModel.disposable()
        ])
        .then(
          results => {
            let type    = results[0];
            let users   = results.filter((r, i) => i);

            console.log({ type : type, users : users.length });

            type.getParents().then(
              parents => {
                console.log('got parent types', parents);

                if ( ! parents ) {
                  DisposableItem
                    .createItem({ type : type, user: shuffle(users)[0] })
                    .then(ok, ko);
                }
                else {
                  parents.reverse();

                  let cursor = 0;

                  let parentItem;

                  let createItem = (parent) => {

                    console.log('--create item', parent);

                    if ( parents[cursor] ) {
                      DisposableItem
                        .createItem({
                          type      :   parents[cursor],
                          parent    :   parent,
                          user      :   shuffle(users)[0]
                        })
                        .then(
                          item => {
                            console.log('item created', item)
                            parentItem = item;
                            cursor ++;
                            createItem(item);
                          },
                          ko
                        );
                    }

                    else {
                      parents.reverse();

                      DisposableItem.createItem({
                        type      :   type,
                        parent    :   parentItem,
                        user      :   shuffle(users)[0]
                      }).then(ok, ko);
                    }

                  };

                  createItem();
                }
              },
              ko
            );
          },
          ko
        );
    });
  }

  static findType (options) {

    options = options || {};

    return new Promise((ok, ko) => {
      let d = new Domain().on('error', ko);

      d.run(() => {
        process.nextTick(() => {
          console.log('disposable item', 'findType', options);

          if ( options.type ) {
            // Object ID
            if ( typeof options.type === 'object' ) {
              TypeModel
                .findById(options.type)
                .exec()
                .then(ok, ko);
            }
          }
          // Find any type
          else {
            TypeModel
              .findOneRandom((error, type) => {
                if ( error ) {
                  return ko(error);
                }
                ok(type);
              });
          }
        });
      });
    });
  }

  static createItem (options) {

    options = options || {};

    let { type, user, parent } = options;

    return new Promise((fulfill, reject) => {
      let d = new Domain().on('error', reject);

      d.run(() => {
        process.nextTick(() => {
          
          let newItem     =   {
            subject       :   'Disposable ' + type.name,
            description   :   'Disposable Item of type ' + type.name +
              "\nCreated " + new Date() ,
            user          :   user._id,
            type          :   type._id
          };

          if ( parent ) {
            newItem.parent = parent._id;
          }

          console.log('!!create item', newItem)

          // Create item in DB and done

          require('syn/models/item')
            .create(newItem, d.intercept(function (item) {
              fulfill(item)
            }));

    
        });
      });
    });

  }

}

export default DisposableItem.dispose;

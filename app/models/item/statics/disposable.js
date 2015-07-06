'use strict';

import TypeModel        from '../../../models/type';
import UserModel        from '../../../models/user';
import ItemModel        from '../../../models/item';
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
    
    return new Promise((ok, ko) => {
      try {
        Promise
          .all([
            DisposableItem.findType(options),
            UserModel.disposable()
          ])
          .then(
            results => {
              try {
                let type    = results[0];
                let users   = results.filter((r, i) => i);


                type.getParents().then(
                  parents => {
                    try {

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


                          if ( parents[cursor] ) {
                            DisposableItem
                              .createItem({
                                type      :   parents[cursor],
                                parent    :   parent,
                                user      :   shuffle(users)[0]
                              })
                              .then(
                                item => {
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
                    }
                    catch ( error ) {
                      ko(error);
                    }
                  },
                  ko
                );
              }
              catch ( error ) {
                ko(error);
              }
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static findType (options) {

    options = options || {};

    return new Promise((ok, ko) => {
      
      try {

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
      }
      catch ( error ) {
        ko(error);
      }

    });
  }

  static createItem (options) {

    options = options || {};

    let { type, user, parent } = options;

    return new Promise((ok, ko) => {
      
      try {
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


        // Create item in DB and done

        let d = new Domain().on('error', ko);

        ItemModel
          .create(newItem, d.intercept(item => ok(item)));
      }
      catch ( error ) {
        ko(error);
      }

    });

  }

}

export default DisposableItem.dispose;

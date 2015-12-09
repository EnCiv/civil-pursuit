'use strict';

import { EventEmitter }           from 'events';
import config                     from '../../../public.json';
import CriteriaModel              from '../../models/criteria';
import TypeModel                  from '../../models/type';
import ItemModel                  from '../../models/item';
import UserModel                  from '../../models/user';

const OTHERS = 5;

class Evaluation {

  constructor (props) {
    for ( var i in props ) {
      this[i] = props[i];
    }
  }

}

class Evaluator extends EventEmitter {

  constructor (userId, itemId) {
    super();

    if ( userId instanceof UserModel || '_id' in userId ) {
      userId = userId._id;
    }

    if ( itemId instanceof ItemModel || '_id' in itemId ) {
      itemId = itemId._id;
    }

    this.itemId     =   itemId;
    this.userId     =   userId;
    this.type       =   'regular';
  }

  // Get model item from DB and panelify it

  getItem () {
    return new Promise((ok, ko) => {
      try {
        ItemModel.findById(this.itemId).then(
          item => {
            try {
              if ( ! item ) {
                throw new Error('Item not found');
              }

              item
                .toPanelItem()
                .then(
                  item => {
                    try {
                      this.item = item;
                      ok();
                    }
                    catch ( error ) {
                      this.emit('error', error);
                    }
                  },
                  ko
                );
            }
            catch ( error ) {
              this.emit('error', error);
            }
          },
          error => this.emit('error', error)
        );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  evaluate () {
    return new Promise((ok, ko) => {
      try {
        this
          .getItem()
          .then(
            () => {
              this.item.type
                .isHarmony()
                .then(
                  is => {
                    try {
                      if ( is ) {
                        this.type = 'split';
                        this.makeSplit().then(ok, ko);
                      }
                      else {
                        this.make().then(ok, ko);
                      }
                    }
                    catch ( error ) {
                      this.emit('error', error);
                    }
                  },
                  ko
                );
            },
            ko
          );
      }
      catch ( error ) {
        this.emit('error', error);
      }
    });
  }

  findType (typeId) {
    return TypeModel.findOne(typeId);
  }

  make () {
    return new Promise((ok, ko) => {

      try {
        Promise.all([
          this.findOthers(OTHERS),
          CriteriaModel.find()
        ])
        .then(
          results => {
            try {
              let [ items, criterias ] = results;

              this
                .packAndGo({ items, criterias })
                .then(ok, ko);
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

  makeSplit () {
    return new Promise((ok, ko) => {
      try {
        this.item.type
          .getOpposite()
          .then(
            right => {
              try {
                let promises = [
                  this.findOthers(5),
                  this.findOthers(6, right),
                  CriteriaModel.find()
                ]

                Promise.all(promises).then(
                  results => {
                    try {
                      let [ left, right, criterias ] = results;
                      this
                        .packAndGo({ left, right, criterias })
                        .then(ok, ko);
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

  findOthers (limit, type) {

    return new Promise((ok, ko) => {
      try {

        let query = {};

        if ( type ) {
          query.type = type._id;
        }
        else {
          query.type = this.item.type._id;
        }

        if ( this.item.lineage.length ) {
          let parent;
          for ( let ancestor of this.item.lineage ) {
            parent = ancestor;
          }
          query.parent    = parent._id;
        }

        query._id = { $ne : this.item._id };

        ItemModel

          .count(query)

          // .where('user').ne(this.userId)

          .then(number => {

            let start = Math.max(0, Math.floor((number-limit)*Math.random()));

            ItemModel

              .find(query, { skip : start, limit, sort : { views: 1, created: 1 } })

              .then(
                items => {
                  Promise
                    .all(items.map(item => item.toPanelItem()))
                    .then(ok, ko);
                },
                ko
              );

          },

          ko);
      }
      catch ( error ) {
        ko(error);
      }
    });

  }

  packAndGo (results) {
    return new Promise((ok, ko) => {
      if ( ! ( 'items' in results ) && ( 'left' in results ) ) {
        results.items = [];

        if ( config["evaluation context item position"] === 'first' ) {
          results.left.unshift(this.item);
        }
        else if ( config["evaluation context item position"] === 'last' ) {
          results.left.push(this.item);
        }

        let max = 6;

        if ( results.left.length < max ) {
          max = results.left.length;
        }

        if ( results.right.length < max ) {
          max = results.right.length;
        }

        for ( var i = 0; i < max; i ++ ) {
          if ( results.left[i] ) {
            results.items.push(results.left[i]);
          }

          if ( results.right[i] ) {
            results.items.push(results.right[i]);
          }
        }
      }

      else {
        if ( config["evaluation context item position"] === 'first' ) {
            results.items.unshift(this.item);
        }
        else if ( config["evaluation context item position"] === 'last' ) {
            results.items.push(this.item);
        }
      }

      let evaluation = new Evaluation({
        split     :   this.type === 'split',
        type      :   this.item.type,
        item      :   this.itemId,
        items     :   results.items/*.map(this.map, this)*/,
        criterias :   results.criterias,
        position  :   config["evaluation context item position"]
      });


      ok(evaluation);
    });
  }

  map (item) {

    return item.toJSON();

  }

}

export { Evaluation, Evaluator };

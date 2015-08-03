'use strict';

import { Domain }                 from 'domain';
import { EventEmitter }           from 'events';
import config                     from '../../../../config.json';
import CriteriaModel              from '../../criteria';
import TypeModel                  from '../../type';

const OTHERS = 5;

class Evaluation {

  constructor (props) {
    for ( var i in props ) {
      this[i] = props[i];
    }
  }

}

class Evaluator extends EventEmitter {

  static Factory (userId, itemId) {
    return new Promise((ok, ko) => {
      new Evaluator(this, userId, itemId)
        .on('error', ko)
        .go()
        .then(ok, ko);
    });
  }

  constructor (model, userId, itemId) {
    super();

    this.ItemModel  =   model;
    this.itemId     =   itemId;
    this.userId     =   userId;
    this.domain     =   new Domain();
    this.type       =   'regular';

    this.domain.on('error', error => this.emit('error', error));

  }

  // Get model item from DB and panelify it

  getItem () {
    return new Promise((ok, ko) => {
      try {
        this
          .ItemModel
          .findById(this.itemId)
          .exec()
          .then(
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

  go () {
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
    return TypeModel.findOne(typeId).exec();
  }

  make () {
    return new Promise((ok, ko) => {

      try {
        Promise.all([
          this.findOthers(OTHERS),
          CriteriaModel
            .find()
            .exec()
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
                  CriteriaModel
                    .find()
                    .exec()
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

        this

          .ItemModel

          .count(query)

          .where('_id').ne(this.item._id)

          // .where('user').ne(this.userId)

          .exec(this.domain.intercept(number => {

            let start = Math.max(0, Math.floor((number-limit)*Math.random()));

            this

              .ItemModel

              .find(query)

              // .populate('user')

              .where('_id').ne(this.item._id)

              // .where('user').ne(this.userId)

              .skip(start)

              .limit(limit)

              .sort({ views: 1, created: 1 })

              .exec()

              .then(
                items => {
                  Promise
                    .all(items.map(item => item.toPanelItem()))
                    .then(ok, ko);
                },
                ko
              );

          }));
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
        else if ( config["evaluation context item position"] === 'first' ) {
            results.items.push(this.item);
        }
      }

      let evaluation = new Evaluation({
        split     :   this.type === 'split',
        type      :   this.item.type,
        item      :   this.itemId,
        items     :   results.items/*.map(this.map, this)*/,
        criterias :   results.criterias
      });


      ok(evaluation);
    });
  }

  map (item) {

    return item.toObject({ transform: function (doc, ret, options) {
      if ( ret.user ) {
        delete ret.user.password;
      }
    }});

  }

}

export default Evaluator.Factory;

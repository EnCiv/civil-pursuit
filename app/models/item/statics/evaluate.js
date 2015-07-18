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
    
    this.domain.on('error', error => this.emit('error', error));

  }

  go () {
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

                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log(this.item)
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')
                        console.log('-------------------------------')

                        this.item.type
                          .isHarmony()
                          .then(
                            is => {
                              try {
                                if ( is ) {
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
        this.emit('error', error);
      }
    });
  }

  findType (typeId) {
    return TypeModel.findOne(typeId).exec();
  }

  make () {
    return new Promise((ok, ko) => {

      Promise.all([
          this.findOthers(OTHERS),
          CriteriaModel
          .find()
          .exec()
        ])
        .then(
          results => {
            this.packAndGo({
              items : results[0],
              criterias : results[1]
            }).then(ok, ko);
          },
          ko
        );
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
                  this.findOthers(2),
                  this.findOthers(3, right),
                  CriteriaModel
                    .find()
                    .exec()
                ]

                Promise.all(promises).then(
                  results => {
                    try {
                      console.log('results', results);
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

        console.log()
        console.log()
        console.log()
        console.log('find others query', query)
        console.log()
        console.log()

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

        for ( var i = 0; i < 3; i ++ ) {
          if ( results.left[i] ) {
            results.items.push(results.left[i]);
          }

          if ( results.right[i] ) {
            results.items.push(results.right[i]);
          }
        }
      }

      if ( config['evaluation context item position'] === 'last' ) {
        results.items.push(this.item);
      }

      else {
        results.items.unshift(this.item);
      }

      let evaluation = new Evaluation({
        type:         this.item.type,
        item:         this.itemId,
        items:        results.items/*.map(this.map, this)*/,
        criterias:    results.criterias
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

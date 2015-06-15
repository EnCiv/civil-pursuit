'use strict';

import { Domain } from 'domain';
import { EventEmitter } from 'events';
import config from 'syn/config.json';
import CriteriaModel from 'syn/models/Criteria';
import TypeModel from 'syn/models/Type';

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
      this.domain.run(() => {
        this
          .ItemModel
          .findById(this.itemId)
          .populate('user')
          .exec(this.domain.intercept(item => {
            
            if ( ! item ) {
              throw new Error('Item not found');
            }


            this.item = item;

            this
              .findType({ parent : this.item.type })
              .then(
                parentType => {
                  if ( ! parentType ) {
                    this.make().then(ok, ko);
                  }
                  else if ( parentType.harmony && parentType.harmony.length && parentType.harmony.some(h => h.toString() === this.item.type.toString()) ) {
                    this.makeSplit().then(ok, ko); 
                  }
                  else {
                    this.make().then(ok, ko);
                  }
                },
                ko
              );

          }));

      });
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
          .find({ type: this.item.type})
          .populate('type')
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
      let right;

      switch ( this.item.type ) {
        case 'Agree':
          right = 'Disagree';
          break;
        
        case 'Disagree':
          right = 'Agree';
          break;
        
        case 'Pro':
          right = 'Con';
          break;
        
        case 'Con':
          right = 'Pro';
          break;
      }

      let promises = [
        this.findOthers(2),
        this.findOthers(3, right),
        CriteriaModel
          .find({ type: this.item.type})
          .populate('type')
          .exec()
      ]

      Promise.all(promise).then(
        results => {
          this.packAndGo({
            left      : results[0],
            right     : results[1],
            criterias : results[2]
          })
            .then(ok, ko);
        }
      );
    });
  }

  findOthers (limit, type) {
    
    return new Promise((ok, ko) => {
      let query = {
        type      :     type || this.item.type,
        parent    :     this.item.parent
      };

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

            .populate('user')

            .where('_id').ne(this.item._id)

            // .where('user').ne(this.userId)

            .skip(start)

            .limit(limit)

            .sort({ views: 1, created: 1 })

            .exec()

            .then(ok, ko);

        }));
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
        items:        results.items.map(this.map, this),
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

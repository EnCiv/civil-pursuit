'use strict';

import { EventEmitter }                 from 'events';
import config                           from '../../../public.json';
import CriteriaModel                    from '../../models/criteria';
import TypeModel                        from '../../models/type';
import ItemModel                        from '../../models/item';
import UserModel                        from '../../models/user';
import sequencer                        from 'promise-sequencer';

const OTHERS = 5;


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Evaluation {

  constructor (props) {
    for ( var i in props ) {
      this[i] = props[i];
    }
  }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

class Evaluator extends EventEmitter {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (userId = {}, itemId = {}) {
    super();

    if ( typeof userId !== 'string' ) {
      if ( userId instanceof UserModel || '_id' in userId ) {
        userId = userId._id;
      }
    }

    if ( typeof itemId !== 'string' ) {
      if ( itemId instanceof ItemModel || '_id' in itemId ) {
        itemId = itemId._id;
      }
    }

    this.itemId     =   itemId;
    this.userId     =   userId;
    this.type       =   'regular';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
                .toPanelItem(this.userId)
                .then(
                  item => {
                    try {
                      this.item = item;
                      ok();
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
                      ko(error);
                    }
                  },
                  ko
                );
            },
            ko
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  findType (typeId) {
    return TypeModel.findOne(typeId);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
              const [ items, criterias ] = results;

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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  makeSplit () {
    return new Promise((ok, ko) => {
      try {
        this.item.type
          .getOpposite()
          .then(
            opposite => {
              try {
                const promises = [];

                if ( config['evaluation context item position'] === 'first' ) {
                  promises.push(
                    this.findOthers(5),
                    this.findOthers(6, opposite),
                    CriteriaModel.find()
                  );
                }
                else {
                  promises.push(
                    this.findOthers(6, opposite),
                    this.findOthers(5),
                    CriteriaModel.find()
                  );
                }

                Promise.all(promises).then(
                  results => {
                    try {
                      const [ left, right, criterias ] = results;
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  findOthers (limit, type) {
    return new Promise((ok, ko) => {
      try {
        const randomItems = [];
        const query =   {};
        if(type) {
          query.type = type._id;
        } else {
          query.type = this.item.type._id;
        }

        if(this.item.parent) {
          query.parent = this.item.parent._id || this.item.parent;
        }

        query._id = { $ne : this.item._id };

        ItemModel
          .count(query)
          // .where('user').ne(this.userId)
          .then(number => {
            const count = Math.min(limit, number); //don't return more items than there are in the query
            const randomNumbers =[];
            let i, rand;

            while(randomNumbers.length < count ){
              rand=Math.max(0, Math.floor((number)*Math.random()));
              i=0;
              while(i<randomNumbers.length) {
                if(randomNumbers[i]===rand){
                  rand=Math.max(0, Math.floor((number)*Math.random()));
                  i= 0; //start while loop again at 0 after i++
                }else {
                  i++;
                }
              } randomNumbers.push(rand);
            }
 //           console.info("evaluate.js randomNumbers, randomNumbers")
            
            for(i=0; i< count; i++){
              randomItems.push(
                sequencer.pipe (
                  () => ItemModel.find(query, {
                          skip      :   randomNumbers[i],
                          limit     : -1
                    }) ,
                  itemList => new Promise((ok, ko) => { itemList[0].toPanelItem(this.userId).then(ok,ko)})
                )
              )
            }
            Promise.all (randomItems).then( ok, ko );
          } )
      }
      catch ( error ) {
        ko(error);
      }
    });

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  packAndGo (results) {
    return new Promise((ok, ko) => {


      // Split (Harmony)

      if ( ! ( 'items' in results ) && ( 'left' in results ) ) {
        const evaluateeFirst = ( config["evaluation context item position"] === 'first' );

        if ( evaluateeFirst ) {
          if ( results.left.length === 1 && ! results.right.length ) {
            results.left = [this.item];
          }
          else {
            results.left.unshift(this.item);
          }
        }
        else {
          if ( results.right.length === 1 && ! results.left.length ) {
            results.right = [this.item];
          }
          else {
            results.right.push(this.item);
          }
        }

        results.items = [];

        let fill = true;

        while ( fill ) {
          if ( evaluateeFirst ) {
            if ( results.left.length ) {
              results.items.push(results.left.shift());
            }
            else {
              fill = false;
            }

            if ( results.right.length ) {
              results.items.push(results.right.shift());
            }
            else {
              fill = false;
            }
          }
          else {
            if ( results.left.length ) {
              results.items.push(results.left.shift());
            }
            else {
              fill = false;
            }

            if ( results.right.length ) {
              results.items.push(results.right.shift());
            }
            else {
              fill = false;
            }
          }

          if ( results.items.length === config['navigator batch size'] ) {
            fill = false;
          }
        }

        if ( ! evaluateeFirst ) {

          if ( results.items.length > 1 && results.items.length % 2 ) {
            results.items.pop();
          }

          let lastItem = results.items[(results.items.length - 1)];

          if ( lastItem.type._id.equals(this.item.type._id) ) {
            lastItem = this.item;
          }
          else {
            results.items.push(this.item);
          }

          results.items[(results.items.length - 1)] = this.item;
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
        items     :   results.items,
        criterias :   results.criterias,
        position  :   config["evaluation context item position"]
      });


      ok(evaluation);
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}

export { Evaluation, Evaluator };

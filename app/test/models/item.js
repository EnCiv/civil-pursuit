'use strict';

import should       from 'should';
import ItemModel    from '../../models/item';
import UserModel    from '../../models/user';

class TestItemModel {

  static main() {
    return new Promise((ok, ko) => {
      Promise
        .all([
          TestItemModel.disposable(),
          TestItemModel.toPanelItem(),
          TestItemModel.evaluate()
        ])
        .then(ok, ko);
    });
  }

  static isItem (item) {
    return new Promise((ok, ko) => {
      try {
        item.should.be.an.Object;

        // _id

        item.should.have.property('_id');

        item._id.constructor.name.should.be.exactly('ObjectID');

        // user

        item.should.have.property('user');

        item.user.constructor.name.should.be.exactly('ObjectID');

        // type

        item.should.have.property('type');

        item.type.constructor.name.should.be.exactly('ObjectID');

        // parent

        if ( item.parent ) {
          item.should.have.property('parent');

          item.parent.constructor.name.should.be.exactly('ObjectID');
        }

        // image

        if ( item.image ) {
          item.should.have.property('image');

          item.image.should.be.a.String;
        }

        // id

        item.should.have.property('id')
          .which.is.a.String;

        // description

        item.should.have.property('description')
          .which.is.a.String;

        // subject

        item.should.have.property('subject')
          .which.is.a.String;

        // views

        item.should.have.property('views')
          .which.is.a.Number;

        // promotions

        item.should.have.property('promotions')
          .which.is.a.Number;

        // references

        item.should.have.property('references')
          .which.is.an.Array;

        if ( item.references.length ) {
          item.references[0].should.be.an.Object;

          item.references[0].should.have.property('url')
            .which.is.a.String;

          if ( item.references[0].title ) {
            item.references[0].should.have.property('title')
              .which.is.a.String;
          }
        }

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static disposable () {
    return new Promise((ok, ko) => {
      try {
        let state = null;

        setTimeout(() => {
          if ( state === null ) {
            ko(new Error('Script timed out: disposable'));
          }
        }, 2500);

        ItemModel
          .disposable()
          .then(
            item => {
              try {
                state = true;
                ok(item);
              }
              catch ( error ) {
                state = false;
                ko(error);
              }
            },
            error => {
              state = false;
              ko(error);
            }
          );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static toPanelItem () {
    return new Promise((ok, ko) => {

      let state = null;

      setTimeout(() => {
        if ( state === null ) {
          ko(new Error('Script timed out: toPanelItem'));
        }
      }, 2500);

      ItemModel
        .disposable()
        .then(
          item => {
            try {
              TestItemModel
                .isItem(item)
                .then(
                  () => {
                    try {
                      item.should.have.property('toPanelItem')
                        .which.is.a.Function;
                      
                      item.toPanelItem().then(
                        () => {
                          try {
                            state = true;
                            ok();
                          }
                          catch ( error ) {
                            state = false;
                            ko(error);
                          }
                        },
                        error => {
                          state = false;
                          ko(error);
                        }
                      );
                    }
                    catch ( error ) {
                      state = false;
                      ko(error);
                    }
                  },
                  error => {
                    state = false;
                    ko(error);
                  }
                );
            }
            catch ( error ) {
              ko(error);
            }
          },
          error => {
            state = false;
            ko(error);
          }
        );
    });
  }

  static evaluate () {
    return new Promise((ok ,ko) => {
      ItemModel
        .disposable()
        .then(
          item => {
            ItemModel
              .evaluate(
                item.user,
                item._id
              )
              .then(
                evaluation => {
                  // console.log('Evaluation', evaluation);
                  ok();
                },
                ko
              );
          },
          ko
        );
    });
  }

}

export default TestItemModel;

'use strict';

import should       from 'should';
import TypeModel    from '../../models/type';

class TestTypeModel {

  static main() {
    return new Promise((ok, ko) => {
      Promise
        .all([
          TestTypeModel.isHarmony()
        ])
        .then(ok, ko);
    });
  }

  static isType (type) {
    return new Promise((ok, ko) => {
      try {
        type.should.be.an.Object;

        // _id

        type.should.have.property('_id');

        type._id.constructor.name.should.be.exactly('ObjectID');

        // name

        type.should.have.property('name');

        type.name.should.be.a.String;

        // harmony

        type.should.have.property('harmony');

        type.harmony.should.be.an.Array;

        // parent

        if ( type.parent ) {
          type.should.have.property('parent');

          type.parent.constructor.name.should.be.exactly('ObjectID');
        }

        ok();
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static isHarmony () {
    return new Promise((ok, ko) => {

      TypeModel
        .findOneRandom((error, type) => {
          if ( error ) {
            return ko(error);
          }

          TestTypeModel.isType(type)
            .then(
              () => {
                try {
                  type
                    .isHarmony()
                    .then(
                      isHarmony => {
                        try {
                          isHarmony.should.be.a.Boolean;
                          console.log(type.name + ' is harmony?', isHarmony);
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
        });

    });
  }

}

export default TestTypeModel;

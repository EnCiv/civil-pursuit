'use strict';

import Type from '../../type';

function countChildren () {
  return new Promise((ok, ko) => {
    try {
      new Promise((ok, ko) => {
        try {
          if ( this.__populated && this.__populated.type ) {
            return ok(this.__populated.type);
          }
          Type.findById(this.type).then(ok, ko);
        }
        catch ( error ) {
          ko(error);
        }
      })
      .then(
        type => {
          try {
            type.getSubtype(this.type)
              .then(
                subtype => {
                  try {
                    this.constructor
                      .count({ parent : this, type : subtype })
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

export default countChildren;

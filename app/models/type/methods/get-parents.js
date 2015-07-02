'use strict';

function getParents () {
  return new Promise((ok, ko) => {
    let parents = [];

    let TypeModel = this.constructor;

    let type = this;

    let getParent = type => {
      TypeModel
        .findById(type.parent)
        .exec()
        .then(
          parent => {
            if ( ! parent ) {
              return ok(parents);
            }
            
            parents.push(parent);

            if ( parent.parent ) {
              getParent(parent);
            }
            else {
              ok(parents);
            }
          },
          ko
        );
    };

    if ( ! this.parent ) {
      return ok(null);
    }

    getParent(this);
  });
}

export default getParents;

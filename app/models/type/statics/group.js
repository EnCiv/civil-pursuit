'use strict';

function group (parent, child, pro, con) {
  return new Promise((ok, ko) => {
    this.create([
      { name : parent },
      { name : child },
      { name : pro },
      { name : con }
    ])
    .then(
      types => {
        try {
          const [ $parent, $child, $pro, $con ] = types;

          Promise.all([
            this.updateById($child._id, { parent : $parent._id }),
            this.updateById($parent._id, { $push : { harmony : [$pro._id, $con._id] }})
          ])
          .then(
            results => {
              const [ $$child, $$parent ] = results;
              ok({ parent : $$parent, subtype : $$child, pro : $pro, con : $con });
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
}

export default group;

'use strict';

function initValues () {
  let values = {};

  values['+0'] = 0;
  values['+1'] = 0;

  return values;
}

function getAccumulation ( itemId , userId) {
  let query = { "item" : { "$oid" : itemId }};
  console.info("upvote.getAccumulation", query, itemId, userId);

  return new Promise((ok, ko) => {
    try {
      let accumulation = {
                    total: 0,
                    userDidUpvote: null,
                    values: initValues()
                  };

      this
        .find(query)
        .then(
          upvote => {
            try {
              console.info("upvote.getAccumulation: upvotes", upvote.length);

              upvote.forEach(upv => {

                let value;

                if ( upv.value === 0 ) {
                  value = '+0';
                }

                else if ( upv.value === 1 ) {
                  value = '+1';
                }

                if (upv.user == userId) {
                  accumulation.userDidUpvote= userId;
                }

                
                accumulation.total ++;

                accumulation.values[value] ++;

              });

              ok(accumulation);
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

export default getAccumulation;

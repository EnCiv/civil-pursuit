'use strict';

function initValues () {
  let values = {};

  values['+0'] = 0;
  values['+1'] = 0;

  return values;
}

function getAccumulation (item) {
  return new Promise((ok, ko) => {
    try {
      let accumulation = {
                    total: 0,
                    userDidUpvote: false;
                    values: initValues()
                  };

      this
        .find({ item })
        .then(
          upvotes => {
            try {
              upvotes.forEach(upvote => {

                let value;

                else if ( upvote.value === 0 ) {
                  value = '+0';
                }

                else if ( upvote.value === 1 ) {
                  value = '+1';
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

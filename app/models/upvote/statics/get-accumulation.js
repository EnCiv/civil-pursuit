'use strict';

function initValues () {
  let values = {};

  values['-1'] = 0;  
  values['+0'] = 0;
  values['+1'] = 0;

  return values;
}

function getAccumulation ( itemId , userId) {
  let query = { "item" :  itemId };
  console.info("upvote.getAccumulation", query, itemId, userId);

  return new Promise((ok, ko) => {
    try {
      let accumulation = {
                    total: 0,
                    userDidUpvote: null,
                    values: initValues()
                  };
      let userDidUpvoteCount=0;

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
                  accumulation.total ++;
                  if (upv.user == userId) {
                    userDidUpvoteCount ++;
                  }
                } else if ( upv.value === -1 ) {
                  value = '-1';
                  accumulation.total --;
                  if (upv.user == userId) {
                    userDidUpvoteCount --;
                  }
                }
                accumulation.values[value] ++;
              });
              if(userDidUpvoteCount) {
                 accumulation.userDidUpvote = userId;                 
              }
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

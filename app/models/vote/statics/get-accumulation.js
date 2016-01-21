'use strict';

function initValues () {
  let values = {};

  values['-1'] = 0;
  values['+0'] = 0;
  values['+1'] = 0;

  return values;
}

function getAccumulation (item) {
  return new Promise((ok, ko) => {
    try {
      let accumulation = {};

      this
        .find({ item })
        .then(
          votes => {
            try {
              votes.forEach(vote => {

                let value;

                if ( vote.value === -1 ) {
                  value = '-1';
                }

                else if ( vote.value === 0 ) {
                  value = '+0';
                }

                else if ( vote.value === 1 ) {
                  value = '+1';
                }

                if ( ! accumulation[vote.criteria] ) {
                  accumulation[vote.criteria] = {
                    total: 0,
                    values: initValues()
                  };
                }

                accumulation[vote.criteria].total ++;

                accumulation[vote.criteria].values[value] ++;

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

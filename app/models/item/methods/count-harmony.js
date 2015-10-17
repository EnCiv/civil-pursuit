'use strict';

import sequencer          from '../../../lib/util/sequencer';
import calcHarmony        from '../../../lib/get-harmony';

function countHarmony () {
  return new Promise((ok, ko) => {
    try {

      const populateType = () => new Promise((ok, ko) => {
        try {
          this
            .populate('type')
            .then(ok, ko);
        }
        catch ( error ) {
          ko(error);
        }
      });

      const getChildren = props => new Promise((ok, ko) => {
        try {
          const { harmony } = this.__populated.type;


          const promises = harmony.map(side =>
            new Promise((ok, ko) => {
              if ( side ) {
                this
                  .constructor
                  .count({
                    parent    :   this,
                    type      :   side
                  })
                  .then(ok, ko);
              }
              else {
                ok(0);
              }
            })
          );

          Promise
            .all(promises)
            .then(
              results => {
                try {
                  [ props.pro, props.con ] = results;
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
      });

      const calculateHarmony = props => {
        props.harmony = calcHarmony(props.pro, props.con);
        return props;
      };

      const sequence = [];

      if ( ! this.__populated || ! this.__populated.type ) {
        sequence.push(populateType);
      }

      sequence.push(getChildren);

      sequencer(sequence)
        .then(
          props => {
            ok(calculateHarmony(props));
          },
          ko
        );
    }
    catch ( error ) {
      ko(error);
    }
  })
};

export default countHarmony;

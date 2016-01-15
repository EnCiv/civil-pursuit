'use strict';

import sequencer from 'sequencer';

function random () {
  return Date.now().toString() + process.pid.toString() + Math.ceil(Math.random() * 97);
}

function group (parent, subtype, pro, con) {

  const groupTypes = { pro, con };

  if ( ! parent ) {
    parent = 'type-parent-' + random();
  }

  if ( ! subtype ) {
    subtype = 'type-subtype-' + random();
  }

  if ( ! pro ) {
    pro = 'type-pro-' + random();
  }

  if ( ! con ) {
    con = 'type-con-' + random();
  }

  return sequencer.pipe(

    () => this.create([
      { name : parent },
      { name : subtype },
      { name : pro },
      { name : con }
    ]),

    types => new Promise((ok, ko) => {
      // console.log({ types });
      groupTypes.pro = types[2];
      groupTypes.con = types[3];
      ok(types);
    }),

    types => Promise.all([
      // Attach parent to subtype
      this.updateById(types[1], { parent : types[0] }),
      // Attach pro to parent
      this.updateById(types[0], { $push : { harmony : types[2] }}),
      // // Attach con to parent
      this.updateById(types[0], { $push : { harmony : types[3] }})
    ]),

    types => new Promise(ok => {
      const [ subtype, parent ] = types;

      ok({ parent, subtype, pro: groupTypes.pro, con : groupTypes.con });
    })

  );

}

export default group;

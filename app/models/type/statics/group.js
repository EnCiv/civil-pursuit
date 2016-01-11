'use strict';

import sequencer from 'sequencer';

function group (parent, subtype, pro, con) {

  const groupTypes = { pro, con };

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

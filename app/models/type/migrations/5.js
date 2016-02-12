'use strict';

import Mungo from 'mungo';
import sequencer from 'promise-sequencer';

/** Remove parent attribute from harmonies
===
Harmony type do not need to have a parent anymore, so remove parent field from all harmonies
*/

class Type extends Mungo.Migration {

  static version = 5;

  static get schema () {
    return {
      "name"        :     {
        type        :     String,
        unique      :     true,
        required    :     true
      },

      "harmony"     :     {
        type        :     [Type],
        default     :     []
      },

      "parent"      :     Type
    };
  }

  static do () {

    return sequencer([

      // get all types

      () => this.find().limit(0),

      // filter types that are harmonies

      types => new Promise(ok => {

        // first we create an array of ObjectIDs of types that are harmonies

        const harmoniesIds = types

          // get types which have harmonies
          .filter(type => type.harmony && type.harmony.length)

          // create array of all harmony types
          .reduce((harmonies, type) => {
            harmonies.push(...(type.harmony));
            return harmonies;
          }, []);

        // Now, using these ids, we find them back in types


        const harmonies = types
          .filter(type => harmoniesIds.some(id => id.equals(type._id)))

          // filter only deprecated harmonies that have parents
          .filter(harmony => harmony.parent);

        ok(harmonies);
      }),

      // save changes in migrations

      harmonies => new Promise((ok, ko) => {
        Promise
          .all(
            harmonies
            .map(harmony => this.revert({ update : {
              get   : { _id : harmony._id },
              set   : { parent : harmony.parent }
            }}))
          )
          .then(() => ok(harmonies), ko);
      }),

      // now apply changes in DB

      harmonies => this.updateByIds(harmonies, { $unset : 'parent' })

    ]);
  }
}

export default Type;

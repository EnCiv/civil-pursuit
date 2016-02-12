;'use strict';

/**
 *  Add harmonies (Why/Why not) to Issue
 */

import Mungo          from 'mungo';
import sequencer      from 'promise-sequencer';
import fixtures       from 'syn/../../fixtures/type/4.json';

class Type extends Mungo.Migration {

  static version = 6;

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

    let oldHarmony = [];

    return sequencer([

      // Remember old harmony

      () => new Promise((ok, ko) => {
        this.findOne({ name : fixtures.parent.name })
          .then(parent => {
            if ( ! parent ) {
              return ko(new Error('Parent not found ' + fixtures.parent.name));
            }

            oldHarmony = parent.harmony;

            ok();
          })
          .catch(ko)
      }),

      // Find harmony if any

      () => Promise.all(fixtures.harmony.map(harmony => this.findOne(harmony))),

      // If no harmonies found, create them

      results => Promise.all(results.map(
        (result, index) => new Promise((ok, ko) => {

          if ( result ) {
            return ok(result);
          }

          this.create(fixtures.harmony[index])
            .then(created => {
              this.revert({ remove : { _id : created._id } })
                .then(() => ok(created))
                .catch(ko);
            })
            .catch(ko);
        })
      )),

      // Update parent

      results => this.updateOne({ name : fixtures.parent.name }, { harmony : results }),

      // Save in miogrations

      parent => this.revert({ update : {
        get : { _id : parent._id },
        set : { harmony : oldHarmony }
      }})

    ]);
  }
}

export default Type;

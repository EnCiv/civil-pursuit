'use strict';

import Mungo            from 'mungo';
import fixtures         from '../../../../fixtures/criteria/1.json';

/** <<<MD
Import data from fixtures to DB
===

    fixtures = [{ name : String }]

Insert `fixtures` into model's collection
MD ***/

class Criteria extends Mungo.Migration {

  static version = 2;

  static schema = {
    "name"          : 	{
      type          :   String,
      required      :   true
    },
    "description"   : 	{
      type          :   String,
      required      :   true
    }
  };

  static do () {
    return new Promise((ok, ko) => {
      try {

        // See if collection is empty

        this.count().then(
          count => {

            // Not empty -- exit

            if ( count ) {
              return ok();
            }

            // Insert all fixtures

            this.create(fixtures).then(

              docs =>

                // Save changes in migrations

                Promise.all(docs.map(doc =>
                  super.revert({ remove : { _id : doc._id } })
                ))

                // Exit

                .then(ok, ko),

              ko
            );
          },
          ko
        );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }
}

export default Criteria;

'use strict';

import fixtures from 'syn/../../fixtures/political-tendency/1.json';
import Mungo from 'mungo';

/** <<<MD
Import data from fixtures to DB
===

    fixtures = [{ name : String }]

Insert `fixtures` into model's collection
MD ***/

class PoliticalTendency extends Mungo.Migration {

  static version = 1;

  static collection = 'political_tendency';

  static schema = { name : String };

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

            console.info("Political Tendency: migration 1" this);

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

export default PoliticalTendency;

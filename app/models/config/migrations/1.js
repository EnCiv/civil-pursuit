'use strict';

import Mungo                  from 'mungo';
import sequencer              from 'sequencer';
import Type                   from 'syn/../../dist/models/type';
import fixtures               from 'syn/../../fixtures/config/1.json';
import SynError               from 'syn/../../dist/lib/app/error';

/** <<<MD
Create config entry for "top level type" which returns a type _id
===

This is the profile of the document we want to insert:

    profile = { name : String, value : ObjectID }

This is what we should get from fixtures:

    fixtures = {
      config : { name : String },
      type : { name : String }
    }

We use `fixtures`'s `config.name` as `profile`'s name.

We use `fixtures`'s `type.name` to fetch Type where `{ name : fixtures.type.name }`.

We use the type found as `profile`'s value.
MD ***/

class Config extends Mungo.Migration {

  static version        =   1

  static collection     =   'config'

  static get schema () {
    return {
      name        :   {
        type      :   String,
        required  :   true,
        unique    :   true
      },
      value       :   Mungo.Type.Mixed
    };
  }

  static get (name) {
    return sequencer.pipe(

      () => this.findOne({ name }),

      config => new Promise((ok, ko) => {
        config ? ok(config.value) : ko(
          new SynError(
            `No such config by the name of ${name}`,
            {},
            SynError.CONFIG_NOT_FOUND
          )
        );
      })

    );
  }

  static do () {
    return new Promise((ok, ko) => {
      try {
        this.get(fixtures.config.name)

          .then(config => {
            // Found? Then nothing to do here - exit

            if ( config ) {
              return ok();
            }
          })

          // Not found -- then create it

          .catch(error => {
            if ( error.code !== SynError.CONFIG_NOT_FOUND ) {
              return ko(error);
            }

            sequencer(

              // Make sure Type has migrated to at least v2

              ()      =>  Type.migrate(2),

              // Find type by name declared in fixtuire

              ()      =>  Type.findOne({ name : fixtures.type.name }),

              // Create new config entry for top-level type

              type    =>  this.create({
                name  :   fixtures.config.name,
                value :   type._id
              }),

              // instructions to undo migration

              config  =>  super.revert({ remove : { _id : config._id } })


            ).then(ok, ko);
          });
      }
      catch ( error ) {
        ko(error);
      }
    });
  }
}

export default Config;

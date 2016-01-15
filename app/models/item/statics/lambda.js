'use strict';

import sequencer from 'sequencer';
import User from 'syn/../../dist/models/user';
import Type from 'syn/../../dist/models/type';
import shuffleArray from 'syn/../../dist/lib/util/shuffle-array';

function lambda (options = {}) {

  return new Promise((ok, ko) => {
    try {

      sequencer(

        // Subject

        () => new Promise((ok, ko) => {
          ok({ subject : options.subject || 'This is a lambda item' })
        }),

        // Description

        () => new Promise((ok, ko) => {
          ok({ description : options.description || "This is a lambda item's description" });
        }),

        // Image

        () => new Promise((ok, ko) => {
          ok(( 'image' in options ) ? { image : options.image } : {});
        }),

        // Reference

        () => new Promise((ok, ko) => {
          ok(( 'references' in options ) ? { references : options.references } : {});
        }),

        // Parent

        () => new Promise((ok, ko) => {
          ok(( 'parent' in options ) ? { parent : options.parent } : {});
        }),

        // User

        () => new Promise((ok, ko) => {
          if ( options.user ) {
            return ok({ user : options.user });
          }
          User
            .lambda()
            .then(user => ok({ user }))
            .catch(ko);
        }),

        // Type

        () => new Promise((ok, ko) => {
          if ( options.type ) {
            return ok({ type : options.type });
          }
          Type
            .group()
            .then(group => {
              let random = shuffleArray([0, 1, 2, 3])[0];

              if ( random === 0 ) {
                return ok({ type : group.parent });
              }

              let type;

              switch ( random ) {
                case 1 : type = group.subtype; break;
                case 2 : type = group.pro; break;
                case 3 : type = group.con; break;
              }

              this
                .lambda({ type : group.parent })
                .then(item => {
                  ok({ parent : item, type })
                })
                .catch(ko);
            })
            .catch(ko);
        })

      )

      .then(results => {
        let item = {};

        results.forEach(result => Object.assign(item, result));

        this.create(item).then(ok, ko);
      })

      .catch(ko);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default lambda;

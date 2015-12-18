'use strict';

import User from '../../user';
import Type from '../../type';

function lambda (options = {}) {
  return new Promise((ok, ko) => {
    try {
      const item = {
        subject : options.subject || 'This is a lambda item',
        description : options.description || "This is a lambda item's description"
      };

      if ( ( 'image' in options ) ) {
        item.image = options.image;
      }

      if ( 'reference' in options ) {
        item.references = [{ url : options.reference.url }];
      }

      if ( 'parent' in options ) {
        item.parent = options.parent;
      }

      Promise.all([
        new Promise((ok, ko) => {
          try {
            if ( options.user ) {
              item.user = options.user;
              return ok();
            }
            User.findOneRandom().then(
              user => {
                try {
                  item.user = user;
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
        }),

        new Promise((ok, ko) => {
          try {
            if ( options.type ) {
              item.type = options.type;

              if ( ! options.subject ) {
                item.subject += ' of type ' + ( item.type.name || item.type );
              }

              return ok();
            }
            Type.findOneRandom().then(
              type => {
                try {
                  item.type = type;

                  if ( ! type.parent ) {
                    return ok();
                  }

                  this.findOneRandom({ type : type.parent }).then(
                    parent => {
                      try {
                        item.parent = parent;
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
              },
              ko
            );
          }
          catch ( error ) {
            ko(error);
          }
        })
      ])
      .then(
        results => {
          try {
            this.create(item).then(ok, ko);
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

export default lambda;

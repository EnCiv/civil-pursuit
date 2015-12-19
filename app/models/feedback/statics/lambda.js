'use strict';

import User from '../../user';
import Type from '../../type';

function lambda (options = {}) {
  return new Promise((ok, ko) => {
    try {
      const feedback = {
        feedback : options.feedback || 'This is a lambda feedback'
      };

      Promise.all([
        new Promise((ok, ko) => {
          try {
            if ( options.user ) {
              feedback.user = options.user;
              return ok();
            }
            User.findOneRandom().then(
              user => {
                try {
                  if ( ! user ) {
                    User.lambda().then(
                      user => {
                        feedback.user = user;
                        ok();
                      },
                      ko
                    );
                  }
                  else {
                    feedback.user = user;
                    ok();
                  }
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
            if ( options.item ) {
              feedback.item = options.item;
              return ok();
            }
            Item.findOneRandom().then(
              item => {
                try {
                  if ( ! item ) {
                    Item.lambda().then(
                      item => {
                        feedback.item = item;
                        ok();
                      },
                      ko
                    );
                  }
                  else {
                    feedback.item = item;
                    ok();
                  }
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
            this.create(feedback).then(ok, ko);
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

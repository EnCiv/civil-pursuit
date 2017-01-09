'use strict';

import User       from '../../user';
import Type       from '../../type';
import Criteria   from '../../criteria';

const values = [ -1, 0 , 1 ];

function lambda (options = {}) {
  return new Promise((ok, ko) => {
    try {
      const vote = {
        value : options.value || values[Math.floor(Math.random()*values.length)]
      };

      Promise.all([
        new Promise((ok, ko) => {
          try {
            if ( options.user ) {
              vote.user = options.user;
              return ok();
            }
            User.findOneRandom().then(
              user => {
                try {
                  if ( ! user ) {
                    User.lambda().then(
                      user => {
                        vote.user = user;
                        ok();
                      },
                      ko
                    );
                  }
                  else {
                    vote.user = user;
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
              vote.item = options.item;
              return ok();
            }
            Item.findOneRandom().then(
              item => {
                try {
                  if ( ! item ) {
                    Item.lambda().then(
                      item => {
                        vote.item = item;
                        ok();
                      },
                      ko
                    );
                  }
                  else {
                    vote.item = item;
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
            if ( options.criteria ) {
              vote.criteria = options.criteria;
              return ok();
            }

            Criteria.findOneRandom().then(
              criteria => {
                try {
                  vote.criteria = criteria;
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

      ])
      .then(
        results => {
          try {
            this.create(vote).then(ok, ko);
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

'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Config                 from 'syn/../../dist/models/config';
import Item                   from 'syn/../../dist/models/item';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import selectors              from 'syn/../../selectors.json';
import Agent                  from 'syn/../../dist/lib/app/agent';
import emitter                from 'syn/../../dist/lib/app/emitter';

function test(props) {
  const locals = {};

  function listenToUpdate (wait = 2000) {
    return it => {
      it('Listen to user update', () => new Promise((ok, ko) => {
        let listened = false;

        const listener = (collection, document) => {
          if ( collection === 'users' &&
            document._id.equals(locals.user._id) ) {
              listened = true;
              locals.user = document;
              ok();
            }
        };

        emitter.on('update', listener);

        setTimeout(() => {
          if ( ! listened ) {
            User.findById(locals.user).then(
              user => {
                if ( user.image ) {
                  locals.user = user;
                  ok();
                }
                else {
                  ko(new Error('Time out after 15 seconds while waiting for user to update'));
                }
              }
            ).catch(ko);
          }
        }, wait);
      }));
    }
  };

  return testWrapper(
    'Story -> Identity',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('User', it => {
          it('should create user', () =>
            User.lambda().then(user => { locals.user = user })
          )
        });
      });

      it('should go home', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}/`)
      );

      it('should sign in', describe.use(
        () => identify(wrappers.driver.client, locals.user)
      ));

      it('should go to profile', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}/page/profile`)
      );

      it('should see Identity panel', () => wrappers.driver.isVisible(
        selectors.identity.selector, 2500
      ));

      it('Image', it => {
        it('should have an uploader', () =>
          wrappers.driver.isVisible(selectors.identity.uploader)
        );

        it('should download image', () => Agent.download(
          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Tim_Bartel.jpg/196px-Tim_Bartel.jpg',
          '/tmp/syn-test-story-identity.jpg'
        ));

        it('should set it as value', () =>
          wrappers.driver.client.setValue(
            selectors.identity.image.input,
            '/tmp/syn-test-story-identity.jpg'
          )
        );

        it('should see image', () =>
          wrappers.driver.isVisible(selectors.identity.image.preview, 5000)
        );

        it('user should have image', it => {
          listenToUpdate(15000)(it);

          it('should have image', () => {
            locals.user.should.have.property('image');
          });
        });
      });

      it('Names', it => {
        it('First name', it => {
          it('should set a first name', () =>
            wrappers.driver.client.setValue(
              selectors.identity.names.first,
              'John'
            )
          );

          it('should unfocus', () =>
            wrappers.driver.client.keys(['\uE004'])
          );

          it('user should have first name', it => {
            listenToUpdate()(it);

            it('should have first name', () => {
              locals.user.should.have.property('first_name')
                .which.is.exactly('John');
            });
          });
        });

        it('Middle name', it => {
          it('should set a middle name', () =>
            wrappers.driver.client.setValue(
              selectors.identity.names.middle,
              'R'
            )
          );

          it('should unfocus', () =>
            wrappers.driver.client.keys(['\uE004'])
          );

          it('user should have middle name', it => {
            listenToUpdate()(it);

            it('should have middle name', () => {
              locals.user.should.have.property('middle_name')
                .which.is.exactly('R');
            });
          });
        });

        it('Last name', it => {
          it('should set a last name', () =>
            wrappers.driver.client.setValue(
              selectors.identity.names.last,
              'Doe'
            )
          );

          it('should unfocus', () =>
            wrappers.driver.client.keys(['\uE004'])
          );

          it('user should have last name', it => {
            listenToUpdate()(it);

            it('should have last name', () => {
              locals.user.should.have.property('last_name')
                .which.is.exactly('Doe');
            });
          });
        });
      });

      describe.pause(15000)(it);

    }
  );
}

export default test;

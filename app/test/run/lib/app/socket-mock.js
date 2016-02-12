'use strict';

import describe           from 'redtea';
import mock               from '../../../../lib/app/socket-mock';
import Socket             from '../../../../lib/app/socket-mockup';
import testWrapper        from '../../../../lib/app/test-wrapper';

function APIMethod (event, message) {
  process.nextTick(() => {
    this.ok(event, message);
  });
}

function test(props) {
  return testWrapper(
    'Lib / App / Socket api mockup',
    { mongodb : true, http : true },
    wrappers => it => {

      const locals = {
        Socket : new Socket({
          port : wrappers.http.app.get('port')
        })
      };

      it('should be a function', (ok, ko) => {
        mock.should.be.a.Function();
      });

      it('should return a promise', () => new Promise((ok, ko) => {
        locals.promise = mock(
          locals.Socket,
          APIMethod.bind(locals.Socket),
          'test',
          'hello'
        );
        locals.promise.should.be.an.instanceOf(Promise);
        ok();
      }));

      it('should listen', () => new Promise((ok, ko) => {
        try {
          locals.promise.then(
            (...messages) => {
              messages[0].should.be.exactly('hello');
              ok();
            },
            ko
          );
        }
        catch ( error ) {
          ko(error);
        }
      }));

    }
  );
}

export default test;

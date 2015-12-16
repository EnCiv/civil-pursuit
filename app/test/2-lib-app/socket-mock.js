'use strict';

import describe           from 'redtea';
import mock               from '../../lib/app/socket-mock';
import Socket             from '../../lib/app/socket-mockup';

function APIMethod (event, message) {
  process.nextTick(() => {
    this.ok(event, message);
  });
}

function test(props) {
  const locals = {
    Socket : new Socket({
      port : props.port
    })
  };
  return describe('Lib / App / Socket api mockup', it => {

    it('should be a function', (ok, ko) => {
      mock.should.be.a.Function();
      ok();
    });

    it('should return a promise', (ok, ko) => {
      locals.promise = mock(
        locals.Socket,
        APIMethod.bind(locals.Socket),
        'test',
        'hello'
      );
      locals.promise.should.be.an.instanceOf(Promise);
      ok();
    });

    it('should listen', (ok, ko) => {
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
    });

  });
}

export default test;

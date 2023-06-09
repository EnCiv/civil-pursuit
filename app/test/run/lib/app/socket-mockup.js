'use strict';

import describe           from 'redtea';
import { EventEmitter }   from 'events';
import should             from 'should';
import Socket             from '../../../../lib/app/socket-mockup';
import testWrapper        from '../../../../lib/app/test-wrapper';

function test(props) {
  const locals = {};
  return testWrapper(
    'Lib / App / Socket connection mockup',
    { mongodb : true, http : true },
    wrappers => it => {

      it('should be a function', (ok, ko) => {
        Socket.should.be.a.Function();
      });

      it('should return an object', (ok, ko) => {
        locals.socket = Socket({
          port : wrappers.http.app.get('port')
        });
        locals.socket.should.be.an.Object();
      });

      it('should be an instance of Emitter', (ok, ko) => {
        locals.socket.should.be.an.instanceof(EventEmitter);
      });

      it('Request', [ it => {
        it('should have a request', (ok, ko) => {
          locals.socket.should.have.property('request');
        });
        it('should be an object', (ok, ko) => {
          locals.socket.request.should.be.an.Object();
        });
        it('headers', [ it => {
          it('should have headers', (ok, ko) => {
            locals.socket.request.should.have.property('headers');
          });
          it('should be an object', (ok, ko) => {
            locals.socket.request.headers.should.be.an.Object();
          });
          it('Host', [ it => {
            it('should have host', (ok, ko) => {
              locals.socket.request.headers.should.have.property('host');
            });
            it('should be right url', (ok, ko) => {
              locals.socket.request.headers.host.should.be.exactly(`localhost:${wrappers.http.app.get('port')}`);
            });
          }]);
          it('Cookie', [ it => {
            it('should have cookie', (ok, ko) => {
              locals.socket.request.headers.should.have.property('cookie');
            });
            it('should be a string', (ok, ko) => {
              locals.socket.request.headers.cookie.should.be.a.String();
            });
          }]);
        }]);
      }]);

      it('Error', [ it => {
        it('should have error', (ok, ko) => {
          locals.socket.should.have.property('error');
        });
        it('should be a function', (ok, ko) => {
          locals.socket.error.should.be.a.Function();
        });
        it('should emit error', (ok, ko) => {
          locals.socket.once('error', error => {
            error.message.should.be.exactly('Foo');
          });
          locals.socket.error(new Error('Foo'));
        });
      }]);

      it('OK', [ it => {
        it('should have ok', (ok, ko) => {
          locals.socket.should.have.property('ok');
        });
        it('should be a function', (ok, ko) => {
          locals.socket.ok.should.be.a.Function();
        });
        it('should emit ok', (ok, ko) => {
          locals.socket.once('OK test', message => {
            message.should.be.exactly(123);
          });
          locals.socket.ok('test', 123);
        });
      }]);

    }
  );
}

export default test;

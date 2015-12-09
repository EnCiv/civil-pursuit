'use strict';

import describe           from 'redtea';
import { EventEmitter }   from 'events';
import Socket             from '../../lib/app/socket-mockup';

function test(props) {
  const locals = {};
  return describe('Lib / App / Socket connection mockup', it => {

    it('should be a function', (ok, ko) => {
      Socket.should.be.a.Function();
      ok();
    });

    it('should return an object', (ok, ko) => {
      locals.socket = Socket({
        port : props.port
      });
      locals.socket.should.be.an.Object();
      ok();
    });

    it('should be an instance of Emitter', (ok, ko) => {
      locals.socket.should.be.an.instanceof(EventEmitter);
      ok();
    });

    it('Request', [ it => {
      it('should have a request', (ok, ko) => {
        locals.socket.should.have.property('request');
        ok();
      });
      it('should be an object', (ok, ko) => {
        locals.socket.request.should.be.an.Object();
        ok();
      });
      it('headers', [ it => {
        it('should have headers', (ok, ko) => {
          locals.socket.request.should.have.property('headers');
          ok();
        });
        it('should be an object', (ok, ko) => {
          locals.socket.request.headers.should.be.an.Object();
          ok();
        });
        it('Host', [ it => {
          it('should have host', (ok, ko) => {
            locals.socket.request.headers.should.have.property('host');
            ok();
          });
          it('should be right url', (ok, ko) => {
            locals.socket.request.headers.host.should.be.exactly(`localhost:${props.port}`);
            ok();
          });
        }]);
        it('Cookie', [ it => {
          it('should have cookie', (ok, ko) => {
            locals.socket.request.headers.should.have.property('cookie');
            ok();
          });
          it('should be a string', (ok, ko) => {
            locals.socket.request.headers.cookie.should.be.a.String();
            ok();
          });
        }]);
      }]);
    }]);

    it('Error', [ it => {
      it('should have error', (ok, ko) => {
        locals.socket.should.have.property('error');
        ok();
      });
      it('should be a function', (ok, ko) => {
        locals.socket.error.should.be.a.Function();
        ok();
      });
      it('should emit error', (ok, ko) => {
        locals.socket.once('error', error => {
          error.message.should.be.exactly('Foo');
          ok();
        });
        locals.socket.error(new Error('Foo'));
      });
    }]);

    it('OK', [ it => {
      it('should have ok', (ok, ko) => {
        locals.socket.should.have.property('ok');
        ok();
      });
      it('should be a function', (ok, ko) => {
        locals.socket.ok.should.be.a.Function();
        ok();
      });
      it('should emit ok', (ok, ko) => {
        locals.socket.once('OK test', message => {
          message.should.be.exactly(123);
          ok();
        });
        locals.socket.ok('test', 123);
      });
    }]);

  });
}

export default test;

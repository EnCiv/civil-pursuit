'use strict';

import fs                   from 'fs';
import { IncomingMessage }  from 'http';
import should               from 'should';
import superagent           from 'superagent';
import describe             from 'redtea';
import Config               from 'syn/../../public.json';
import Agent                from '../../../../lib/app/agent';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Agent' , it => {

    it('should be a class', () => {
        Agent.should.be.a.Function();
      }
    );

    it('Request', it => {

      it('should have a request method', () => {
          Agent.should.have.property('request')
            .which.is.a.Function();
        }
      );

      it('should return a superagent request', () => {
          locals.request = Agent.request('http://example.com');

          locals.request.should.be.an.instanceof(superagent.Request);
        }
      );

      it('should have a user agent', () => {
          locals.request.should.have.property('header')
            .which.is.an.Object()
            .and.have.property('user-agent')
            .which.is.exactly(Config.userAgent);
        }
      );

    });

    it('Promise', it => {
      it('should be a promise', () => {
          locals.promise = Agent.promise(locals.request);
          locals.promise.should.be.an.instanceof(Promise);
        }
      );

      it('should then response', () => new Promise((ok, ko) => {
          locals.promise.then(
            response => {
              locals.response = response;
              ok();
            },
            ko
          );
        })
      );
    });

    it('Response', it => {
      it('should be an incoming message', () => {
          locals.response.should.be.an.instanceof(IncomingMessage);
        }
      );

      it('should be a 200', () => {
          locals.response.should.have.property('statusCode')
            .which.is.exactly(200);
        }
      );
    });

    it('Get', it => {
      it('should be a promise', () => {
          locals.promise = Agent.get('http://example.com');
          locals.promise.should.be.an.instanceof(Promise);
        }
      );

      it('should then response', () => new Promise((ok, ko) => {
        locals.promise.then(
          response => {
            locals.response = response;
            ok();
          },
          ko
        );
      }));

      it('should be an incoming message', () => {
          locals.response.should.be.an.instanceof(IncomingMessage);
        }
      );

      it('should be a 200', () => {
          locals.response.should.have.property('statusCode')
        }
      );
    });

    it('Download', it => {
      it('should be a promise', () => {
          locals.promise = Agent.download('http://example.com', '/tmp/example.com');
          locals.promise.should.be.an.instanceof(Promise);
        }
      );

      it('should then response', () => new Promise((ok, ko) => {
          locals.promise.then(
            response => {
              locals.response = response;
              ok();
            },
            ko
          );
        })
      );

      it('should have copied file', () => new Promise((ok, ko) => {
          locals.data = '';

          fs.createReadStream('/tmp/example.com')
            .on('data', data => locals.data += data.toString())
            .on('end', ok)
            .on('error', ko);
        })
      );

      it('should be a HTTP response', () => {
          /<title>Example Domain<\/title>/.test(locals.data).should.be.true();
        }
      );
    });

  });

}

export default test;

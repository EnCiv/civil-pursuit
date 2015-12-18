'use strict';

import fs                   from 'fs';
import { IncomingMessage }  from 'http';
import should               from 'should';
import superagent           from 'superagent';
import config               from '../../../secret.json';
import describe             from 'redtea';
import Agent                from '../../lib/app/agent';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Agent' , [
    {
      'should be a class' : (ok, ko) => {
        Agent.should.be.a.Function();
      }
    },
    {
      'Request' : [
        {
          'should have a request method' : (ok, ko) => {
            Agent.should.have.property('request')
              .which.is.a.Function();
          }
        },
        {
          'should return a superagent request' : (ok, ko) => {
            locals.request = Agent.request('http://example.com');

            locals.request.should.be.an.instanceof(superagent.Request);
          }
        },
        {
          'should have a user agent' : (ok, ko) => {
            locals.request.should.have.property('req')
              .which.is.an.Object()
              .and.have.property('_headers')
              .which.is.an.Object()
              .and.have.property('user-agent')
              .which.is.exactly(config['user agent']);
          }
        }
      ]
    },
    {
      'Promise' : [
        {
          'should be a promise' : (ok, ko) => {
            locals.promise = Agent.promise(locals.request);
            locals.promise.should.be.an.instanceof(Promise);
          }
        },
        {
          'should then response' : () => new Promise((ok, ko) => {
            locals.promise.then(
              response => {
                locals.response = response;
                ok();
              },
              ko
            );
          })
        }
      ]
    },
    {
      'Response' : [
        {
          'should be an incoming message' : (ok, ko) => {
            locals.response.should.be.an.instanceof(IncomingMessage);
          }
        },
        {
          'should be a 200' : (ok, ko) => {
            locals.response.should.have.property('statusCode')
              .which.is.exactly(200);
          }
        }
      ]
    },
    {
      'Get' : [
        {
          'should be a promise' : (ok, ko) => {
            locals.promise = Agent.get('http://example.com');
            locals.promise.should.be.an.instanceof(Promise);
          }
        },
        {
          'should then response' : () => new Promise((ok, ko) => {
            locals.promise.then(
              response => {
                locals.response = response;
                ok();
              },
              ko
            );
          })
        },
        {
          'should be an incoming message' : (ok, ko) => {
            locals.response.should.be.an.instanceof(IncomingMessage);
          }
        },
        {
          'should be a 200' : (ok, ko) => {
            locals.response.should.have.property('statusCode')
          }
        }
      ]
    },
    {
      'Download' : [
        {
          'should be a promise' : (ok, ko) => {
            locals.promise = Agent.download('http://example.com', '/tmp/example.com');
            locals.promise.should.be.an.instanceof(Promise);
          }
        },
        {
          'should then response' : () => new Promise((ok, ko) => {
            locals.promise.then(
              response => {
                locals.response = response;
                ok();
              },
              ko
            );
          })
        },
        {
          'should have copied file' : () => new Promise((ok, ko) => {
            locals.data = '';

            fs.createReadStream('/tmp/example.com')
              .on('data', data => locals.data += data.toString())
              .on('end', ok)
              .on('error', ko);
          })
        },
        {
          'should be a HTTP response' : (ok, ko) => {
            /<title>Example Domain<\/title>/.test(locals.data).should.be.true();
          }
        }
      ]
    }
  ] );

}

export default test;

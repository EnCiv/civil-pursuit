'use strict';

import should               from 'should';
import describe             from 'redtea';
import config               from '../../../secret.json';

function test () {

  const locals = {};

  return describe ( 'Secret config' , [
    {
      'should be an object' : (ok, ko) => {
        config.should.be.an.Object();
        ok();
      }
    },
    {
      'should have tmp' : (ok, ko) => {
        config.should.have.property('tmp').which.is.a.String();
        ok();
      }
    },
    {
      'Cloudinary' : [
        {
          'should have cloudinary' : (ok, ko) => {
            config.should.have.property('cloudinary')
              .which.is.an.Object();
            ok();
          }
        },
        {
          'should have a cloud name' : (ok, ko) => {
            config.cloudinary.should.have.property('cloud')
              .which.is.an.Object()
              .and.have.property('name')
              .which.is.a.String();

            ok();
          }
        },
        {
          'should have url' : (ok, ko) => {
            config.cloudinary.should.have.property('url')
              .which.is.a.String()
              .and.startWith('cloudinary://');

            ok();
          }
        },
        {
          'API' : [
            {
              'should have API' : (ok, ko) => {
                config.cloudinary.should.have.property('API')
                  .which.is.an.Object();

                ok();
              }
            },
            {
              'should have key' : (ok, ko) => {
                config.cloudinary.API.should.have.property('key')
                  .which.is.a.String();

                ok();
              }
            },
            {
              'should have secret' : (ok, ko) => {
                config.cloudinary.API.should.have.property('secret')
                  .which.is.a.String();

                ok();
              }
            }
          ]
        }
      ]
    },
    {
      'Cookie' : [
        {
          'should have a cookie' : (ok, ko) => {
            config.should.have.property('cookie').which.is.an.Object();
            ok();
          }
        },
        {
          'should have path' : (ok, ko) => {
            config.cookie.should.have.property('path')
              .which.is.a.String();

            ok();
          }
        },
        {
          'should have signed' : (ok, ko) => {
            config.cookie.should.have.property('signed')
              .which.is.a.Boolean();

            ok();
          }
        },
        {
          'should have maxAge' : (ok, ko) => {
            config.cookie.should.have.property('maxAge')
              .which.is.a.Number();

            ok();
          }
        },
        {
          'should have httpOnly' : (ok, ko) => {
            config.cookie.should.have.property('httpOnly')
              .which.is.a.Boolean();

            ok();
          }
        }
      ]
    },
    {
      'instances' : [
        {
          'should be an array' : (ok, ko) => {
            config.should.have.property('instances').which.is.an.Array();
            ok();
          }
        },
        {
          'should be strings' : (ok, ko) => {
            config.instances.forEach(instance => instance.should.be.a.String());
            ok();
          }
        }
      ]
    },
    {
      'Facebook' : [
        {
          'should have property facebook' : (ok, ko) => {
            config.should.have.property('facebook')
              .which.is.an.Object();
            ok();
          }
        },
        {
          'should have property for each env' : (ok, ko) => {
            try {
              config.instances.forEach(instance =>
                config.facebook.should.have.property(instance)
                  .which.is.an.Object()
              );
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          }
        },
        {
          'should have app id' : (ok, ko) => {
            config.instances.forEach(instance =>
              config.facebook[instance].should.have.property('app id')
                .which.is.a.String()
            );
            ok();
          }
        },
        {
          'should have app secret' : (ok, ko) => {
            config.instances.forEach(instance =>
              config.facebook[instance].should.have.property('app secret')
                .which.is.a.String()
            );
            ok();
          }
        },
        {
          'should have callback url' : (ok, ko) => {
            config.instances.forEach(instance =>
              config.facebook[instance].should.have.property('callback url')
                .which.is.a.String()
            );
            ok();
          }
        }
      ]
    },
    {
      'Twitter' : [
        {
          'should have property twitter' : (ok, ko) => {
            config.should.have.property('twitter')
              .which.is.an.Object();
            ok();
          }
        },
        {
          'should have property for each env' : (ok, ko) => {
            config.instances.forEach(instance =>
              config.twitter.should.have.property(instance)
                .which.is.an.Object()
            );
            ok();
          }
        },
        {
          'should have key' : (ok, ko) => {
            config.instances.forEach(instance =>
              config.twitter[instance].should.have.property('key')
                .which.is.a.String()
            );
            ok();
          }
        },
        {
          'should have secret' : (ok, ko) => {
            config.instances.forEach(instance =>
              config.twitter[instance].should.have.property('secret')
                .which.is.a.String()
            );
            ok();
          }
        },
        {
          'should have callback url' : (ok, ko) => {
            config.instances.forEach(instance =>
              config.twitter[instance].should.have.property('callback url')
                .which.is.a.String()
            );
            ok();
          }
        }
      ]
    },
    {
      'User agent' : (ok, ko) => {
        config.should.have.property('user agent').which.is.a.String();
        ok();
      }
    },
    {
      'Email' : [
        {
          'should be an object' : (ok, ko) => {
            config.should.have.property('email').which.is.an.Object();
            ok();
          }
        },
        {
          'should have user' : (ok, ko) => {
            config.email.should.have.property('user').which.is.a.String();
            ok();
          }
        },
        {
          'should have password' : (ok, ko) => {
            config.email.should.have.property('password').which.is.a.String();
            ok();
          }
        }
      ]
    },
    {
      'should have forgot password email text' : (ok, ko) => {
        config.should.have.property('forgot password email').which.is.a.String();
        ok();
      }
    },
    {
      'should have default user' : (ok, ko) => {
        config.should.have.property('default user').which.is.a.String();
        ok();
      }
    }
  ] );

}

export default test;

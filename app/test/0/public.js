'use strict';

import should               from 'should';
import describe             from 'redtea';
import config               from '../../../public.json';

function test () {

  const locals = {};

  return describe ( 'Public config' , [
    {
      'should be an object' : (ok, ko) => {
        config.should.be.an.Object();
        ok();
      }
    },
    {
      'Profile' : [
        {
          'should have a property Profile' : (ok, ko) => {
            config.should.have.property('profile').which.is.an.Object();
            ok();
          }
        },
        {
          'identity' : [
            {
              'should have a property identity' : (ok, ko) => {
                config.profile.should.have.a.property('identity').which.is.an.Object();
                ok();
              }
            },
            {
              'should have a property description' : (ok, ko) => {
                config.profile.identity.should.have.property('description')
                  .which.is.a.String();
                ok();
              }
            }
          ]
        },
        {
          'residence' : [
            {
              'should have a property residence' : (ok, ko) => {
                config.profile.should.have.a.property('residence').which.is.an.Object();
                ok();
              }
            },
            {
              'should have a property description' : (ok, ko) => {
                config.profile.residence.should.have.property('description')
                  .which.is.a.String();
                ok();
              }
            },
            {
              'should have a property image' : (ok, ko) => {
                config.profile.residence.should.have.property('image')
                  .which.is.a.String();
                /https?:\/\//.test(config.profile.residence.image).should.be.true();
                ok();
              }
            }
          ]
        },
        {
          'demographics' : [
            {
              'should have a property demographics' : (ok, ko) => {
                config.profile.should.have.a.property('demographics').which.is.an.Object();
                ok();
              }
            },
            {
              'should have a property description' : (ok, ko) => {
                config.profile.demographics.should.have.property('description')
                  .which.is.a.String();
                ok();
              }
            },
            {
              'should have a property image' : (ok, ko) => {
                config.profile.demographics.should.have.property('image')
                  .which.is.a.String();
                /https?:\/\//.test(config.profile.demographics.image).should.be.true();
                ok();
              }
            }
          ]
        },
        {
          'voter' : [
            {
              'should have a property voter' : (ok, ko) => {
                config.profile.should.have.a.property('voter').which.is.an.Object();
                ok();
              }
            },
            {
              'should have a property description' : (ok, ko) => {
                config.profile.voter.should.have.property('description')
                  .which.is.a.String();
                ok();
              }
            },
            {
              'should have a property image' : (ok, ko) => {
                config.profile.voter.should.have.property('image')
                  .which.is.a.String();
                /https?:\/\//.test(config.profile.voter.image).should.be.true();
                ok();
              }
            }
          ]
        },
        {
          'public persona' : [
            {
              'should have a property public persona' : (ok, ko) => {
                config.profile.should.have.a.property('public persona').which.is.an.Object();
                ok();
              }
            },
            {
              'should have a property description' : (ok, ko) => {
                config.profile['public persona'].should.have.property('description')
                  .which.is.a.String();
                ok();
              }
            },
            {
              'should have a property image' : (ok, ko) => {
                config.profile['public persona'].should.have.property('image')
                  .which.is.a.String();
                /https?:\/\//.test(config.profile['public persona'].image).should.be.true();
                ok();
              }
            }
          ]
        }
      ]
    },
    {
      'Navigator batch size' : [
        {
          'should have a batch size' : (ok, ko) => {
            config.should.have.property('navigator batch size').which.is.a.Number();
            ok();
          }
        }
      ]
    },
    {
      'Google Analytcis key' : [
        {
          'should have a google analytics key' : (ok, ko) => {
            config.should.have.property('google analytics')
              .which.is.a.Object()
              .and.have.property('key').which.is.a.String();
            ok();
          }
        }
      ]
    },
    {
      'Default item image' : [
        {
          'should have a default item image' : (ok, ko) => {
            config.should.have.property('default item image').which.is.a.String().and.startWith('http');
            ok();
          }
        }
      ]
    },
    {
      'Font awesome CDN' : [
        {
          'should have Font Awesome CDN' : (ok, ko) => {
            config.should.have.property('font awesome')
              .which.is.a.Object()
              .and.have.property('cdn')
              .which.is.a.String()
              .and.startWith('http');
            ok();
          }
        }
      ]
    },
    {
      'Evaluated item postion' : [
        {
          'should have evaluated item default position' : (ok, ko) => {
            config.should.have.property('evaluation context item position').which.is.a.String();
            ok();
          }
        },
        {
          'should be either first or last' : (ok, ko) => {
            ['first', 'last'].indexOf(config['evaluation context item position']).should.be.above(-1);
            ok();
          }
        }
      ]
    }
  ] );

}

export default test;

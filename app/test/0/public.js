'use strict';

import should               from 'should';
import describe             from 'redtea';
import config               from '../../../public.json';

function test () {

  const locals = {};

  return describe ( 'Public config' , [
    {
      'should be an object' : () =>
        config.should.be.an.Object()
    },
    {
      'Profile' : [
        {
          'should have a property Profile' : () =>
            config.should.have.property('profile').which.is.an.Object()
        },
        {
          'identity' : [
            {
              'should have a property identity' : () =>
                config.profile.should.have.a.property('identity').which.is.an.Object()
            },
            {
              'should have a property description' : () =>
                config.profile.identity.should.have.property('description')
                  .which.is.a.String()
            }
          ]
        },
        {
          'residence' : [
            {
              'should have a property residence' : () =>
                config.profile.should.have.a.property('residence').which.is.an.Object()
            },
            {
              'should have a property description' : () =>
                config.profile.residence.should.have.property('description')
                  .which.is.a.String()
            },
            {
              'should have a property image' : () => {
                config.profile.residence.should.have.property('image')
                  .which.is.a.String();

                /https?:\/\//.test(config.profile.residence.image).should.be.true()
              }
            }
          ]
        },
        {
          'demographics' : [
            {
              'should have a property demographics' : () =>
                config.profile.should.have.a.property('demographics').which.is.an.Object()
            },
            {
              'should have a property description' : () =>
                config.profile.demographics.should.have.property('description')
                  .which.is.a.String()
            },
            {
              'should have a property image' : () => {
                config.profile.demographics.should.have.property('image')
                  .which.is.a.String();

                /https?:\/\//.test(config.profile.demographics.image).should.be.true()
              }
            }
          ]
        },
        {
          'voter' : [
            {
              'should have a property voter' : () =>
                config.profile.should.have.a.property('voter').which.is.an.Object()
            },
            {
              'should have a property description' : () =>
                config.profile.voter.should.have.property('description')
                  .which.is.a.String()
            },
            {
              'should have a property image' : () => {
                config.profile.voter.should.have.property('image')
                  .which.is.a.String();

                /https?:\/\//.test(config.profile.voter.image).should.be.true()
              }
            }
          ]
        },
        {
          'public persona' : [
            {
              'should have a property public persona' : () =>
                config.profile.should.have.a.property('public persona').which.is.an.Object()
            },
            {
              'should have a property description' : () =>
                config.profile['public persona'].should.have.property('description')
                  .which.is.a.String()
            },

            {
              'should have a property image' : () => {
                config.profile['public persona'].should.have.property('image')
                  .which.is.a.String();

                /https?:\/\//.test(config.profile['public persona'].image).should.be.true()
              }
            }
          ]
        }
      ]
    },
    {
      'Navigator batch size' : [
        {
          'should have a batch size' : () =>
            config.should.have.property('navigator batch size').which.is.a.Number()
        }
      ]
    },
    {
      'Google Analytcis key' : [
        {
          'should have a google analytics key' : () =>
            config.should.have.property('google analytics')
              .which.is.a.Object()
              .and.have.property('key').which.is.a.String()
        }
      ]
    },
    {
      'Default item image' : [
        {
          'should have a default item image' : () =>
            config.should.have.property('default item image').which.is.a.String().and.startWith('http')
        }
      ]
    },
    {
      'Font awesome CDN' : [
        {
          'should have Font Awesome CDN' : () =>
            config.should.have.property('font awesome')
              .which.is.a.Object()
              .and.have.property('cdn')
              .which.is.a.String()
              .and.startWith('http')
        }
      ]
    },
    {
      'Evaluated item postion' : [
        {
          'should have evaluated item default position' : () =>
            config.should.have.property('evaluation context item position').which.is.a.String()
        },
        {
          'should be either first or last' : () =>
            ['first', 'last'].indexOf(config['evaluation context item position']).should.be.above(-1)
        }
      ]
    }
  ] );

}

export default test;

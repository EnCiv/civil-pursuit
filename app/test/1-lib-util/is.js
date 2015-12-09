'use strict';

import should               from 'should';
import describe             from 'redtea';
import Is                   from '../../lib/util/is';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Is' , [
    {
      'should be a function' : (ok, ko) => {
        Is.should.be.a.Function();
        ok();
      }
    },
    {
      'Lesser than' : [
        {
          'should be a function' : (ok, ko) => {
            Is.should.have.property('lesserThan')
              .which.is.a.Function();

            ok();
          }
        },
        {
          'should return a function' : (ok, ko) => {
            locals.isLesserThan10 = Is.lesserThan(10);
            locals.isLesserThan10.should.be.a.Function();
            ok();
          }
        },
        {
          'should return true if lesser than' : (ok, ko) => {
            locals.isLesserThan10(5).should.be.true();
            ok();
          }
        },
        {
          'should return false if not lesser than' : (ok, ko) => {
            locals.isLesserThan10(15).should.be.false();
            ok();
          }
        },
        {
          'should return false if equal' : (ok, ko) => {
            locals.isLesserThan10(10).should.be.false();
            ok();
          }
        }
      ]
    },
    {
      'Is URL' : [
        {
          'should be a function' : (ok, ko) => {
            Is.should.have.property('url')
              .which.is.a.Function();

            ok();
          }
        },
        {
          'should return a function' : (ok, ko) => {
            locals.isUrl = Is.lesserThan(10);
            locals.isUrl.should.be.a.Function();
            ok();
          }
        },
        {
          'should return true if url' : (ok, ko) => {
            locals.isUrl('http://').should.be.true();
            ok();
          }
        },
        {
          'should return false if not url' : (ok, ko) => {
            locals.isUrl('hello').should.be.true();
            ok();
          }
        }
      ]
    }
  ] );

}

export default test;

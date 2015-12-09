'use strict';

import should               from 'should';
import describe             from 'redtea';
import Component            from '../../lib/app/component';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Component' , [
    {
      'should be a class' : (ok, ko) => {
        Component.should.be.a.Function();
        ok();
      }
    },
    {
      'should have a classList method' : (ok, ko) => {
        Component.should.have.property('classList').which.is.a.Function();
        ok();
      }
    },
    {
      'should return a string of classes' : (ok, ko) => {
        locals.classes = Component.classList({
          props : {
            className : 'foo1 foo2'
          }
        }, 'foo3', 'foo4');
        locals.classes.should.be.exactly('foo1 foo2 foo3 foo4');
        ok();
      }
    }
  ] );

}

export default test;

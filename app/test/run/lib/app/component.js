'use strict';

import should               from 'should';
import describe             from 'redtea';
import Component            from '../../../../lib/app/component';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Component' , it => {
    it('should be a class', () => {
        Component.should.be.a.Function();
      }
    );

    it('should have a classList method', () => {
        Component.should.have.property('classList').which.is.a.Function();
      }
    );

    it('should return a string of classes', () => {
        locals.classes = Component.classList({
          props : {
            className : 'foo1 foo2'
          }
        }, 'foo3', 'foo4');
        locals.classes.should.be.exactly('foo1 foo2 foo3 foo4');
      }
    );
  });

}

export default test;

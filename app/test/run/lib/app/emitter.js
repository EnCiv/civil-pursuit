'use strict';

import should               from 'should';
import describe             from 'redtea';
import emitter              from '../../../../lib/app/emitter';
import { EventEmitter }     from 'events';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Emitter' , it => {

    it('should be an instance of EventEmitter', () => {
      emitter.should.be.an.instanceof(EventEmitter);
    });

  });

}

export default test;

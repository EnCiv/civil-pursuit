'use strict';

import should               from 'should';
import describe             from 'redtea';
import sequencer            from '../../lib/util/sequencer';

function test () {

  const locals = {
    props : {}
  };

  return describe ( 'Lib / Util / Sequencer' , [
    {
      'should be a function' : (ok, ko) => {
        sequencer.should.be.a.Function();
      }
    },
    {
      'should return a promise' : () => new Promise((ok, ko) => {
        locals.promise = sequencer([
          props => new Promise((ok, ko) => {
            props.foo = true;
            ok();
          }),
          props => new Promise((ok, ko) => {
            props.bar = false;
            ok();
          })
        ], locals.props);
        locals.promise.should.be.an.instanceof(Promise);
        ok();
      })
    },
    {
      'should fulfill' : () => new Promise((ok, ko) => {
        locals.promise.then(
          results => {
            locals.results = results;
            ok();
          },
          ko
        );
      })
    },
    {
      'should have results' : (ok, ko) => {
        locals.results.should.be.an.Object();

        locals.results.should.have.property('foo').which.is.true();
        locals.results.should.have.property('bar').which.is.false();

        locals.props.should.have.property('foo').which.is.true();
        locals.props.should.have.property('bar').which.is.false();
      }
    }
  ] );

}

export default test;

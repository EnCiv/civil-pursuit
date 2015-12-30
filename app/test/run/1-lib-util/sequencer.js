'use strict';

import should               from 'should';
import describe             from 'redtea';
import sequencer            from 'syn/../../dist/lib/util/sequencer';

function test () {

  const locals = {
    props : {}
  };

  return describe ( 'Lib / Util / Sequencer' , it => {

    it('should be a function', () => sequencer.should.be.a.Function());

    it('should return a promise', () => new Promise((ok, ko) => {
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
    );

    it('should fulfill', () => new Promise((ok, ko) => {
        locals.promise.then(
          results => {
            locals.results = results;
            ok();
          },
          ko
        );
      })
    );

    it('should have results', () => {
        locals.results.should.be.an.Object();

        locals.results.should.have.property('foo').which.is.true();
        locals.results.should.have.property('bar').which.is.false();

        locals.props.should.have.property('foo').which.is.true();
        locals.props.should.have.property('bar').which.is.false();
      }
    );

  });

}

export default test;

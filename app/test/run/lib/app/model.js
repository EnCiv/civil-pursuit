'use strict';

import should               from 'should';
import Mungo                from 'mungo';
import describe             from 'redtea';
import Model                from 'syn/../../dist/lib/app/model';
import emitter              from 'syn/../../dist/lib/app/emitter';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Model', it => {

    it('should be a class', () => {
        Model.should.be.a.Function();
      }
    );

    it('should extend Mungo Model', () => {
        new Model().should.be.an.instanceof(Mungo.Model);
      }
    );

    it('Emit', it => {

      it('should have emit property', () => {
          Model.should.have.property('emit').which.is.a.Function();
        }
      );

      it('should return a promise and emit', () => new Promise((ok, ko) => {
          emitter.on('created', (collection, document) => {
            collection.should.be.exactly('models');
            document.should.be.an.Object();
            Object.keys(document).should.have.length(0);
            ok();
          });
          locals.promise = Model.emit('created', {});
          locals.promise.should.be.an.instanceof(Promise);
      }));

    });

  });

}

export default test;

'use strict';

import should               from 'should';
import Mungo                from 'mungo';
import describe             from 'redtea';
import Model                from '../../lib/app/model';
import emitter              from '../../lib/app/emitter';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Model' , [
    {
      'should be a class' : (ok, ko) => {
        Model.should.be.a.Function();
      }
    },
    {
      'should extend Mungo Model' : (ok, ko) => {
        new Model().should.be.an.instanceof(Mungo.Model);
      }
    },
    {
      'Emit' :  [
        {
          'should have emit property' : (ok, ko) => {
            Model.should.have.property('emit').which.is.a.Function();
          }
        },
        {
          'should return a promise and emit' : () => new Promise((ok, ko) => {
            emitter.on('created', (collection, document) => {
              collection.should.be.exactly('models');
              document.should.be.an.Object();
              Object.keys(document).should.have.length(0);
              ok();
            });
            locals.promise = Model.emit('created', {});
            locals.promise.should.be.an.instanceof(Promise);
          })
        }
      ]
    }
  ] );

}

export default test;

'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import Config         from '../../../models/config';
import isDocument     from './is-document';

function isConfig (config, compare = {}, serialized = false) {
  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', ok => ok());

    it('should be a document', describe.use(() => isDocument(config, compare, serialized)));

    if ( ! serialized ) {
      it('should be a Config', (ok, ko) => {
        config.should.be.an.instanceof(Config);
        ok();
      });
    }

    it('name', [ it => {
      it('should have name', (ok, ko) => {
        config.should.have.property('name');
        ok();
      });
      it('should be a string', (ok, ko) => {
        config.name.should.be.a.String();
        ok();
      });
      if ( 'name' in compare ) {
        it('should match compare', (ok, ko) => {
          config.name.should.be.exactly(compare.name);
          ok();
        });
      }
    }]);

    it('value', [ it => {
      it('should have value', (ok, ko) => {
        config.should.have.property('value');
        ok();
      });
      if ( 'value' in compare ) {
        it('should match compare', (ok, ko) => {
          config.value.should.be.exactly(compare.value);
          ok();
        });
      }
    }]);
  };
}

export default isConfig;

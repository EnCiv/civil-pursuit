'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import Race           from 'syn/../../dist/models/race';
import isDocument     from './document';

function isRace (race, compare = {}, serialized = false) {

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    it('should be a document', describe.use(() => isDocument(race, compare, serialized)));

    if ( ! serialized ) {
      it('should be a race', (ok, ko) => {
        race.should.be.an.instanceof(Race);
      });
    }

    it('should have a name', (ok, ko) => {
      race.should.have.property('name').which.is.a.String();
    });

    if ( 'name' in compare ) {
      it('name should match compare', (ok, ko) => {
        race.name.should.be.exactly(compare.name);
      });
    }
  };

}

export default isRace;

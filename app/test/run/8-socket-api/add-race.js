'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from 'syn/../../dist/lib/app/socket-mock';
import addRace                    from 'syn/../../dist/api/add-race';
import isUser                     from 'syn/../../dist/test/assertions/is-user';
import User                       from 'syn/../../dist/models/user';
import Race                       from 'syn/../../dist/models/race';
import isRace                     from 'syn/../../dist/test/assertions/is-race';

function test (props) {
  const locals = {};

  return describe ( ' API / Add Race', it => {

    it('Race', it => {

      it('should get race', () => new Promise((ok, ko) => {
        Race.findOneRandom().then(
          race => {
            locals.race = race;
            ok();
          },
          ko
        );
      }));

      it('should be a race', describe.use(() => isRace(locals.race)));

    });

    it('Add race as a document', () => new Promise((ok, ko) => {
      mock(props.socket, addRace, 'add race', locals.race)
        .then(
          user => {
            locals.user = user;
            ok();
          },
          ko
        );
    }));

    it('User', it => {

      it('is a user', describe.use(() => isUser(locals.user)));

      it('has race', () => new Promise((ok, ko) => {
        locals.user.should.have.property('race').which.is.an.Array().and.have.length(1);

        locals.user.race.some(race => race.equals(locals.race._id)).should.be.true();

        ok();
      }));

    });

  });
}

export default test;

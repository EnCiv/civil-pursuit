'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import testWrapper                from 'syn/../../dist/lib/app/test-wrapper';
import mock                       from 'syn/../../dist/lib/app/socket-mock';
import addRace                    from 'syn/../../dist/api/add-race';
import isUser                     from 'syn/../../dist/test/is/user';
import User                       from 'syn/../../dist/models/user';
import Race                       from 'syn/../../dist/models/race';
import isRace                     from 'syn/../../dist/test/is/race';

function test (props) {
  const locals = {};

  return testWrapper(
    'API -> Add Race',
    {
      mongodb : true,
      http : { verbose : true },
      sockets : true
    },
    wrappers => it => {

      it('Race', it => {

        it('should get race', () =>
          Race.findOneRandom().then(race => { locals.race = race })
        );

        it('should be a race', describe.use(() => isRace(locals.race)));

      });

      it('Add race as a document', () =>
        mock(wrappers.apiClient, addRace, 'add race', locals.race)
          .then(user => { locals.user = user })
      );

      it('User', it => {

        it('is a user', describe.use(() => isUser(locals.user)));

        it('has race', () => {
          locals.user.should.have.property('race').which.is.an.Array().and.have.length(1);

          locals.user.race.some(race => race.equals(locals.race._id)).should.be.true();

        });

      });

    }
  );
}

export default test;

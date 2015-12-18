'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from '../../lib/app/socket-mock';
import addRace                    from '../../api/add-race';
import isUser                     from '../.test/assertions/is-user';
import User                       from '../../models/user';
import Race                       from '../../models/race';
import isRace                     from '../.test/assertions/is-race';

function test (props) {
  const locals = {};

  return describe ( ' API / Add Race', [
    {
      'Race' : [
        {
          'should get race' : () => new Promise((ok, ko) => {
            Race.findOneRandom().then(
              race => {
                locals.race = race;
                ok();
              },
              ko
            );
          })
        },
        {
          'should be a race' : describe.use(() => isRace(locals.race))
        }
      ]
    },
    {
      'Add race as a document' : () => new Promise((ok, ko) => {
        mock(props.socket, addRace, 'add race', locals.race)
          .then(
            user => {
              locals.user = user;
              ok();
            },
            ko
          );
      })
    },
    {
      'User' : [
        {
          'is a user' : describe.use(() => isUser(locals.user))
        },
        {
          'has race' : () => new Promise((ok, ko) => {
            locals.user.should.have.property('race').which.is.an.Array().and.have.length(1);

            locals.user.race.some(race => race.equals(locals.race._id)).should.be.true();

            ok();
          })
        }
      ]
    }
  ]);
}

export default test;

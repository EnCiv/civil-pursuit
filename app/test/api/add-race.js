'use strict';

import describe                   from '../../lib/util/describe';
import should                     from 'should';
import mock                       from '../mock';
import addRace                    from '../../api/add-race';
import isUser                     from '../../lib/assertions/user';
import User                       from '../../models/user';
import Race                       from '../../models/race';
import isRace                     from '../../lib/assertions/race';

function test (props) {
  const locals = {};

  return describe ( ' API / Add Race', [
    {
      'Race' : [
        {
          'should get race' : (ok, ko) => {
            Race.findOneRandom().then(
              race => {
                locals.race = race;
                ok();
              },
              ko
            );
          }
        },
        {
          'should be a race' : (ok, ko) => {
            locals.race.should.be.a.race();
            ok();
          }
        }
      ]
    },
    {
      'Add race as a document' : (ok, ko) => {
        mock(props.socket, addRace, 'add race', locals.race)
          .then(
            user => {
              locals.user = user;
              ok();
            },
            ko
          );
      }
    },
    {
      'User' : [
        {
          'is a user' : (ok, ko) => {
            locals.user.should.be.a.user();
            ok();
          }
        },
        {
          'has race' : (ok, ko) => {
            locals.user.should.have.property('race').which.is.an.Array().and.have.length(1);

            locals.user.race.some(race => race.equals(locals.race._id)).should.be.true();

            ok();
          }
        }
      ]
    }
  ]);
}

export default test;

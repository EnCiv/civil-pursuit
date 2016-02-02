'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Race                   from 'syn/../../dist/models/race';

const { Query, Migration } = Mungo;

const Race1 = Race.migrations[1];

function testRace1 (props) {

  const locals = {
    outdated : { name : 'outdated' }
  };

  return testWrapper(
    'Models -> Race -> Migrations -> 1',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {
      it('No old config DB -- do nothing', it => {
        it('Migrate to v1', it => {
          it('should apply migration #1', () => Race.migrate(1));
        });

        it('Verify', it => {
          it('Race is empty', it => {
            it('should get race',
              () => Race.find().then(races => { locals.races = races })
            );

            it(`They should be 0 races`, () => {
              locals.races.should.have.length(0);
            });
          });

          it('Verify migrations', it => {

            it('There should be no migrations', it => {
              it('should get migrations',
                () => Migration.model
                  .find({ collection : Race1.collection, version : 1 })
                  .then(migrations => { locals.migrations = migrations })
              );

              it(`They should be 0 migrations`, () => {
                locals.migrations.should.have.length(0);
              });
            });
          });
        });

        describe.pause(60000)(it);
      });
    }
  );
}

export default testRace1;

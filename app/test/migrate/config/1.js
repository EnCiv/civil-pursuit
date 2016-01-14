'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Config                 from 'syn/../../dist/models/config';
import Type                   from 'syn/../../dist/models/type';
import fixtures               from 'syn/../../fixtures/config/1.json';

const { Query, Migration } = Mungo;

const Config1 = Config.migrations[1];

function testType2 (props) {

  const locals = {
    outdated : { name : 'outdated' }
  };

  return testWrapper(
    'Models -> Config -> Migrations -> 1',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {
      it('Migrate to v1', it => {
        it('should apply migration #1', () => Config.migrate(1));
      });

      it('Verify', it => {
        it('Verify Config', it => {
          it('should get config',
            () => Config.find().then(configs => { locals.configs = configs })
          );

          it(`They should be 1 config`, () => {
            locals.configs.should.have.length(1);
          });

          it('config should have the right name', () => {
            locals.configs[0].name.should.be.exactly(fixtures.config.name);
          });

          it('config value should be an object id', () => {
            locals.configs[0].value.should.be.an.instanceof(Mungo.mongodb.ObjectID);
          });
        });

        it('Verify value', it => {
          it('should get type from config value',
            () => Type
              .findById(locals.configs[0].value)
              .then(type => { locals.type = type })
          );

          it('should have the same name than in fixtures',
            () => locals.type
              .should.have.property('name')
              .which.is.exactly(fixtures.type.name)
          );
        });

        it('Verify migrations', it => {

          it('Verify insertion', it => {
            it('should get migrations',
              () => Migration.model
                .find({ collection : Config1.collection, version : 1 })
                .then(migrations => { locals.migrations = migrations })
            );

            it(`They should be 1 migrations`, () => {
              locals.migrations.should.have.length(1);
            });

            it('they should all have remove instructions',
              () => {
                locals.migrations.forEach(migration =>
                  migration.should.have.property('remove')
                    .which.is.an.Object()
                );
              }
            );

            it('all remove instructions should have id',
              () => {
                locals.migrations.forEach(migration =>
                  migration.remove.should.have.property('_id')
                );
              }
            );

            it('should remove the right _id',
              () => locals.migrations[0].remove._id
                .equals(locals.configs[0]._id)
                .should.be.true()
            );
          });
        });
      });

      it('undo', it => {
        it('should undo', () => Config1.undo());
      });

      it('should have removed types', it => {
        it('get all types',
          () => new Query(Config1).find().then(configs => {
            locals.configs = configs;
          })
        );

        it('configs should be empty', () => locals.configs.should.have.length(0));
      });

    }
  );
}

export default testType2;

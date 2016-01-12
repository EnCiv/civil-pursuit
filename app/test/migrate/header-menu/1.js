'use strict';

import describe               from 'redtea';
import should                 from 'should';
import Mungo                  from 'mungo';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import HeaderMenu             from 'syn/../../dist/models/header-menu';
import fixtures               from 'syn/../../fixtures/header-menu/1.json';

const { Query, Migration } = Mungo;

const HeaderMenu1 = HeaderMenu.migrations[1];

function testHeaderMenu1 (props) {

  const locals = {};

  return testWrapper(
    'HeaderMenu Model -> Migrations -> 1',
    {
      mongodb : {
        migrate : false
      }
    },
    wrappers => it => {
      it('Migrate to v1', it => {
        it('should apply migration #1', () => HeaderMenu.migrate(1));
      });

      it('Verify', it => {
        it('Verify HeaderMenu', it => {
          it('should get config',
            () => HeaderMenu.find().then(menus => { locals.menus = menus })
          );

          it(`They should be ${fixtures.length} menus`, () => {
            locals.menus.should.have.length(fixtures.length);
          });

          it('All fixtures should have been inserted',
            () => fixtures
              .every(fixture => locals.menus
                .some(menu => menu.title === fixture.title))
                .should.be.true()
          );
        })

        it('Verify migrations', it => {

          it('Verify insertion', it => {
            it('should get migrations',
              () => Migration.model
                .find({ collection : HeaderMenu1.collection, version : 1 })
                .then(migrations => { locals.migrations = migrations })
            );

            it(`They should be ${fixtures.length} migrations`, () => {
              locals.migrations.should.have.length(fixtures.length);
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

            it('All fixtures should have remove instructions',
              () => locals.migrations
                .every(migration => locals.menus
                  .some(menu => menu._id.equals(migration.remove._id)))
                  .should.be.true()
            );
          });
        });
      });

      it('undo', it => {
        it('should undo', () => HeaderMenu1.undo());
      });

      it('should have removed types', it => {
        it('get all types',
          () => new Query(HeaderMenu1).find().then(menus => {
            locals.menus = menus;
          })
        );

        it('menus should be empty', () => locals.menus.should.have.length(0));
      });

    }
  );
}

export default testHeaderMenu1;

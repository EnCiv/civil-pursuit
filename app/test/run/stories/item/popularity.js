'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import selectors              from 'syn/../../selectors.json';
import Item                   from 'syn/../../dist/models/item';
import Config                 from 'syn/../../dist/models/config';
import identify               from 'syn/../../dist/test/util/e2e-identify';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Item -> Popularity',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('Get top level type', it => {
          it('should get top level type from config', () =>
            Config.get('top level type').then(type => { locals.type = type })
          );
        });

        it('Create item', it => {
          it('should create item', () =>
            Item.lambda({ type : locals.type })
              .then(item => { locals.item = item })
          );
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should sign in', describe.use(
        () => identify(wrappers.driver.client, locals.user)
      ));


      it('should close training', () => wrappers.driver.click(
        selectors.training.close, 5000
      ));

      it('should have a popularity button', () =>
        wrappers.driver.exists([
          selectors.item.id.prefix + locals.item._id,
          selectors.item.popularity
        ].join(' ')));

      it('should say 0%', () =>
        wrappers.driver.hasText([
          selectors.item.id.prefix + locals.item._id,
          selectors.item.popularity,
          '> span span:first-child'
        ].join(' '), '0%'));

      it('should add 1 view to item', () => Item.updateById(
        locals.item, { $inc : { 'views' : 1 } }
      ));

      it('should say 0%', () =>
        wrappers.driver.hasText([
          selectors.item.id.prefix + locals.item._id,
          selectors.item.popularity,
          '> span span:first-child'
        ].join(' '), '0%'));

      it('should add 1 promotions to item', () => Item.updateById(
        locals.item, { $inc : { 'promotions' : 1 } }
      ));

      it('should say 100%', () =>
        wrappers.driver.hasText([
          selectors.item.id.prefix + locals.item._id,
          selectors.item.popularity,
          '> span span:first-child'
        ].join(' '), '100%'));

    }
  );
}

export default test;

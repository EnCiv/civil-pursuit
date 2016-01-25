'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import selectors              from 'syn/../../selectors.json';
import Item                   from 'syn/../../dist/models/item';
import Type                   from 'syn/../../dist/models/type';
import Config                 from 'syn/../../dist/models/config';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import createItem             from 'syn/../../dist/test/util/e2e-create-item';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Item -> Children',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('Get top level type', it => {
          it('should get top level type from config', () =>
            Config.get('top level type').then(type => { locals.type = type })
          );
        });

        it('should get type', () => Type.findById(locals.type)
          .then(type => { locals.type = type })
        );

        it('should get subtype', () => locals.type.getSubtype()
          .then(subtype => { locals.subtype = subtype })
        );

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

      it('should have a subtype button', () =>
        wrappers.driver.exists([
          selectors.item.id.prefix + locals.item._id,
          selectors.item.subtype
        ].join(' '))
      );

      it('should say 0', () =>
        wrappers.driver.hasText([
          selectors.item.id.prefix + locals.item._id,
          selectors.item.subtype,
          '> span span:first-child'
        ].join(' '), '0')
      );

      it('should click on subtype button', () =>
        wrappers.driver.click([
          selectors.item.id.prefix + locals.item._id,
          selectors.item.subtype
        ].join(' '))
      );

      it('should click on toggle create subtype', () =>
        wrappers.driver.click([
          selectors.item.id.prefix + locals.item._id,
          selectors.subtype,
          selectors.create.toggle
        ].join(' '))
      );

      it('should create item',
        describe.use(() => createItem(wrappers.driver, [
          selectors.item.id.prefix + locals.item._id,
          selectors.subtype
        ].join(' '), {
          subject : 'Test subtype',
          description : 'Test subtype'
        }))
      );

      it('should say 1', () =>
        wrappers.driver.hasText([
          selectors.item.id.prefix + locals.item._id,
          selectors.item.subtype,
          '> span span:first-child'
        ].join(' '), '1')
      );

    }
  );
}

export default test;

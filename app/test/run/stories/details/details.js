'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from '../../../../models/user';
import testWrapper            from '../../../../lib/app/test-wrapper';
import Item                   from '../../../../models/item';
import Config                 from '../../../../models/config';
import createItem             from '../../../util/e2e-create-item';
import selectors              from '../../../../../selectors.json';
import isItem                 from '../../../is/item';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Details -> View Item Details',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('Top Level Type', it => {
          it('should get top level type from config', () =>
            Config.get('top level type')
              .then(type => { locals.topLevelType = type })
          )
        });

        it('Item', it => {
          it('should create item', () =>
            Item.lambda({ type : locals.topLevelType })
              .then(item => { locals.item = item })
          );

          it('should get item details', () =>
            Item.getDetails(locals.item)
              .then(details => { locals.details = details })
          );
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should see item', () =>
        wrappers.driver.isVisible(
          `${selectors.item.id.prefix}${locals.item._id}`, 2500
        )
      );

      it('should click on details toggler', () =>
        wrappers.driver.client.click([
          `${selectors.item.id.prefix}${locals.item._id}`,
          selectors.item.togglers.details
        ].join(' '))
      );

      it('should see item details', () =>
        wrappers.driver.isVisible(
          `${selectors.details.id.prefix}${locals.item._id}`, 2500
        )
      );

    }
  );
}

export default test;

'use strict';

import describe               from 'redtea';
import should                 from 'should';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Item                   from 'syn/../../dist/models/item';
import Config                 from 'syn/../../dist/models/config';
import selectors              from 'syn/../../selectors.json';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Evaluation -> Not signed-in',
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
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should close training', () => wrappers.driver.click(
        selectors.training.close, 5000
      ));

      it('should see item 1', () =>
        wrappers.driver.isVisible(
          `${selectors.item.id.prefix}${locals.item._id}`, 2500
        )
      );

      it('should click on evaluation toggler', () =>
        wrappers.driver.client.click([
          `${selectors.item.id.prefix}${locals.item._id}`,
          selectors.item.togglers.evaluation
        ].join(' '))
      );

      it('should not see evaluation', () => wrappers.driver.doesNotExist(
        `${selectors.evaluation.id.prefix}${locals.item._id}`, 2000
      ));

      it('should see join form', () => wrappers.driver.isVisible(
        selectors.join.form, 2500
      ));
    }
  );
}

export default test;

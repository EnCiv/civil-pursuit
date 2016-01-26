'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Item                   from 'syn/../../dist/models/item';
import Config                 from 'syn/../../dist/models/config';
import createItem             from 'syn/../../dist/test/util/e2e-create-item';
import selectors              from 'syn/../../selectors.json';
import isItem                 from 'syn/../../dist/test/is/item';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import isEvaluationView       from 'syn/../../dist/test/is/evaluation-view';
import isDetailsView          from 'syn/../../dist/test/is/details-view';
import Feedback               from 'syn/../../dist/models/feedback';

function test(props) {
  const locals = {
    items : []
  };

  return testWrapper(
    'Story -> Evaluation -> Finish',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('User', it => {
          it('should create user', () =>
            User.lambda().then(user => { locals.user = user })
          )
        });

        it('Top Level Type', it => {
          it('should get top level type from config', () =>
            Config.get('top level type')
              .then(type => { locals.topLevelType = type })
          )
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('Item #1', it => {
        it('should create item', () =>
          Item.lambda({ type : locals.topLevelType, subject : 'Item #1' })
            .then(item => { locals.items.push(item) })
        );

        it('should sign in', describe.use(
          () => identify(wrappers.driver.client, locals.user)
        ));

        it('should close training', () => wrappers.driver.click(
          selectors.training.close, 5000
        ));

        it('should see item 1', () =>
          wrappers.driver.isVisible(
            `${selectors.item.id.prefix}${locals.items[0]._id}`, 2500
          )
        );

        it('should click on evaluation toggler', () =>
          wrappers.driver.client.click([
            `${selectors.item.id.prefix}${locals.items[0]._id}`,
            selectors.item.togglers.evaluation
          ].join(' '))
        );

        it('should see evaluation', () => wrappers.driver.exists(
          `${selectors.evaluation.id.prefix}${locals.items[0]._id}`, 2000
        ));

        it('should scroll to finish button', () =>
          wrappers.driver.client.scroll([
            `${selectors.evaluation.id.prefix}${locals.items[0]._id}`,
            selectors.evaluation.button
          ].join(' '))
        );

        it('should say Finish', () =>
          wrappers.driver.hasText([
            `${selectors.evaluation.id.prefix}${locals.items[0]._id}`,
            selectors.evaluation.button
          ].join(' '), 'Finish')
        );

        it('should click Finish', () =>
          wrappers.driver.click([
            `${selectors.evaluation.id.prefix}${locals.items[0]._id}`,
            selectors.evaluation.button
          ].join(' '))
        );

        describe.pause(1500)(it);

        it('should show details', describe.use(() => isDetailsView(
          wrappers.driver, locals.items[0]
        )));
      });

      it('Item #2', it => {
        it('should create item', () =>
          Item.lambda({ type : locals.topLevelType, subject : 'Item #2' })
            .then(item => { locals.items.push(item) })
        );

        it('should sign in', describe.use(
          () => identify(wrappers.driver.client, locals.user)
        ));

        it('should close training', () => wrappers.driver.click(
          selectors.training.close, 5000
        ));

        it('should see item 2', () =>
          wrappers.driver.isVisible(
            `${selectors.item.id.prefix}${locals.items[1]._id}`, 2500
          )
        );

        it('should click on evaluation toggler', () =>
          wrappers.driver.client.click([
            `${selectors.item.id.prefix}${locals.items[1]._id}`,
            selectors.item.togglers.evaluation
          ].join(' '))
        );

        it('should see evaluation', () => wrappers.driver.exists(
          `${selectors.evaluation.id.prefix}${locals.items[1]._id}`, 2000
        ));

        it('should scroll to finish button', () =>
          wrappers.driver.client.scroll([
            `${selectors.evaluation.id.prefix}${locals.items[1]._id}`,
            selectors.evaluation.button
          ].join(' '))
        );

        it('should say Finish', () =>
          wrappers.driver.hasText([
            `${selectors.evaluation.id.prefix}${locals.items[1]._id}`,
            selectors.evaluation.button
          ].join(' '), 'Finish')
        );

        it('should click Finish', () =>
          wrappers.driver.click([
            `${selectors.evaluation.id.prefix}${locals.items[1]._id}`,
            selectors.evaluation.button
          ].join(' '))
        );

        describe.pause(1500)(it);

        it('should show details', describe.use(() => isDetailsView(
          wrappers.driver, locals.items[1]
        )));
      });

      it('Item #3', it => {
        it('should create item', () =>
          Item.lambda({ type : locals.topLevelType, subject : 'Item #3' })
            .then(item => { locals.items.push(item) })
        );

        it('should sign in', describe.use(
          () => identify(wrappers.driver.client, locals.user)
        ));

        it('should close training', () => wrappers.driver.click(
          selectors.training.close, 5000
        ));

        it('should see item 3', () =>
          wrappers.driver.isVisible(
            `${selectors.item.id.prefix}${locals.items[2]._id}`, 2500
          )
        );

        it('should click on evaluation toggler', () =>
          wrappers.driver.client.click([
            `${selectors.item.id.prefix}${locals.items[2]._id}`,
            selectors.item.togglers.evaluation
          ].join(' '))
        );

        it('should see evaluation', () => wrappers.driver.exists(
          `${selectors.evaluation.id.prefix}${locals.items[2]._id}`, 2000
        ));

        it('should scroll to finish button', () =>
          wrappers.driver.client.scroll([
            `${selectors.evaluation.id.prefix}${locals.items[2]._id}`,
            selectors.evaluation.button
          ].join(' '))
        );

        it('should say Neither', () =>
          wrappers.driver.hasText([
            `${selectors.evaluation.id.prefix}${locals.items[2]._id}`,
            selectors.evaluation.button
          ].join(' '), 'Neither')
        );

        it('should click Finish', () =>
          wrappers.driver.click([
            `${selectors.evaluation.id.prefix}${locals.items[2]._id}`,
            selectors.evaluation.button
          ].join(' '))
        );

        describe.pause(1000)(it);

        it('should say Finish', () =>
          wrappers.driver.hasText([
            `${selectors.evaluation.id.prefix}${locals.items[2]._id}`,
            selectors.evaluation.button
          ].join(' '), 'Finish')
        );

        it('should click Finish', () =>
          wrappers.driver.click([
            `${selectors.evaluation.id.prefix}${locals.items[2]._id}`,
            selectors.evaluation.button
          ].join(' '))
        );

        describe.pause(1500)(it);

        it('should show details', describe.use(() => isDetailsView(
          wrappers.driver, locals.items[0]
        )));
      });

      describe.pause(15000)(it);
    }
  );
}

export default test;
